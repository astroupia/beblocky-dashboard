"use client";

import { useState } from "react";
import { Search, MoreVertical, UserPlus } from "lucide-react";

const users = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "User", status: "Inactive" },
];

export function UserTable() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90">
            <UserPlus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-4 px-6 font-semibold">Name</th>
              <th className="text-left py-4 px-6 font-semibold">Email</th>
              <th className="text-left py-4 px-6 font-semibold">Role</th>
              <th className="text-left py-4 px-6 font-semibold">Status</th>
              <th className="text-left py-4 px-6 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-muted/50">
                <td className="py-4 px-6">{user.name}</td>
                <td className="py-4 px-6">{user.email}</td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    user.role === "Admin" ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    user.status === "Active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <button className="p-2 hover:bg-muted rounded-full">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}