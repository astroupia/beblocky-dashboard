import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { createUser, updateUser, deleteUser } from "@/lib/actions/user.actions";
import { connectToDatabase } from "@/lib/database";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
    return new NextResponse("Webhook secret is missing", { status: 500 });
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("svix headers are missing");
    return new NextResponse("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new NextResponse("Error occurred", { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Received event ${eventType}`);

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const user = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      firstName: first_name || "",
      lastName: last_name || "",
      role: "customer",
    };

    try {
      console.log("Connecting to database...");
      await connectToDatabase();
      console.log("Connected to database. Creating user...");

      const newUser = await createUser(user);
      console.log("New user created:", JSON.stringify(newUser));
      return new Response(
        JSON.stringify({ message: "User created successfully" }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error creating user:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
        return new Response(
          JSON.stringify({
            error: "Failed to create user",
            details: error.message,
            stack: error.stack,
          }),
          { status: 500 }
        );
      } else {
        console.error("Unknown error:", error);
        return new Response(
          JSON.stringify({
            error: "Failed to create user",
            details: "An unknown error occurred",
          }),
          { status: 500 }
        );
      }
    }
  }

  if (eventType === "user.updated") {
    const { id, first_name, last_name } = evt.data;

    const user = {
      firstName: first_name || "",
      lastName: last_name || "",
    };

    try {
      console.log("Connecting to database...");
      await connectToDatabase();
      console.log("Connected to database. Updating user...");

      const updatedUser = await updateUser(id, user);
      console.log("User updated successfully:", JSON.stringify(updatedUser));
      return NextResponse.json({ message: "User updated", user: updatedUser });
    } catch (error) {
      console.error("Error updating user:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
        return NextResponse.json(
          {
            error: "Failed to update user",
            details: error.message,
            stack: error.stack,
          },
          { status: 500 }
        );
      } else {
        console.error("Unknown error:", error);
        return NextResponse.json(
          {
            error: "Failed to update user",
            details: "An unknown error occurred",
          },
          { status: 500 }
        );
      }
    }
  }

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
  return new NextResponse("Webhook processed", { status: 200 });
}
