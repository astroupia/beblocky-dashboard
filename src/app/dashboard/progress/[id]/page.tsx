import { getUser } from "@/actions/student";
import { getStudentProgress } from "@/actions/progress";
import { PageHeader } from "@/components/page-header";
import { StudentInfo } from "@/components/student-info";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Overview } from "@/components/weekly-report";
import { Clock, Coins, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
export default async function Page({ params }: { params: { id: string } }) {
  const [user, progress] = await Promise.all([
    getUser(params.id),
    getStudentProgress(params.id),
  ]);

  const hoursSpent = progress?.hoursSpent || 0;
  const hours = Math.floor(hoursSpent);
  const minutes = Math.round((hoursSpent - hours) * 60);
  const achievements = progress?.achievements || [];

  return (
    <div>
      <PageHeader showBackBtn />
      <div className="flex">
        <div className=" md:hidden border-b"></div>
        <div className="md:w-9/12 py-6 space-y-6 gap-4 w-full">
          <div className=" flex md:flex-row flex-col md:items-center w-full gap-4">
            <div className=" md:w-7/12 w-full">
              <div className=" flex items-center justify-between">
                <div>
                  <p className=" font-medium text-lg">Time Spending</p>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl">
                      <span className="font-bold">{hours}</span>
                      <span>h</span>
                    </p>
                    <p className="text-3xl">
                      <span className="font-bold">{minutes}</span>
                      <span>m</span>
                    </p>
                  </div>
                </div>
                <h3>Weekly Data</h3>
                {/* <Select defaultValue="weekly">
                  <SelectTrigger className=" w-min">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select> */}
              </div>
              <Overview />
            </div>
            <div className="flex flex-col py-2 justify-between">
              <div className="flex flex-row sm:flex-row items-center">
                <div className="rounded-full p-3 bg-ecstasy-100/50 mr-5">
                  <Clock className="text-ecstasy" size={40} />
                </div>
                <div className="flex flex-col text-xl">
                  <span className="text-base">Hours Spent</span>
                  <span className="font-bold">{hoursSpent.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex my-2 flex-row sm:flex-row items-center">
                <div className="rounded-full p-3 bg-ecstasy-100/50 mr-5">
                  <Coins className="text-ecstasy" size={40} />
                </div>
                <div className="flex flex-col text-xl">
                  <span className="text-base">Coins Earned</span>
                  <Badge variant="default">Coming Soon</Badge>
                </div>
              </div>
              <div className="flex my-2 flex-row sm:flex-row items-center">
                <div className="rounded-full p-3 bg-ecstasy-100/50 mr-5">
                  <Trophy className="text-ecstasy" size={40} />
                </div>
                <div className="flex flex-col text-xl">
                  <span className="text-base">Achievements</span>
                  <Badge variant="default">Coming Soon</Badge>
                  {/* <span className="font-bold">3</span> */}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div>
              <h3 className="font-bold text-2xl">Achievements</h3>
              <div className=" flex flex-col justify-between space-y-4 mt-4">
                <div className=" flex items-center gap-2">
                  <div className="flex flex-row sm:flex-row items-center">
                    <div className="rounded-full p-3 bg-ecstasy-100/50 mr-5">
                      <Trophy className="text-ecstasy" size={20} />
                    </div>
                  </div>
                  <p className=" font-bold text-xl">Coding Streak</p>
                  <Badge variant="default">Coming Soon</Badge>
                </div>
                <div className=" flex items-center gap-2">
                  <div className="flex flex-row sm:flex-row items-center">
                    <div className="rounded-full p-3 bg-ecstasy-100/50 mr-5">
                      <Trophy className="text-ecstasy" size={20} />
                    </div>
                  </div>
                  <p className=" font-bold text-xl">Mastery Level</p>
                  <Badge variant="default">Coming Soon</Badge>
                </div>
                <div className=" flex items-center gap-2">
                  <div className="flex flex-row sm:flex-row items-center">
                    <div className="rounded-full p-3 bg-ecstasy-100/50 mr-5">
                      <Trophy className="text-ecstasy" size={20} />
                    </div>
                  </div>
                  <p className=" font-bold text-xl">Finished Challenge</p>
                  <Badge variant="default">Coming Soon</Badge>
                </div>
              </div>
            </div>
            {/* <h3 className="font-bold text-2xl">Achievements</h3> */}
            <div className=" flex flex-col justify-between space-y-4 mt-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-2">
                  <div className="flex flex-row sm:flex-row items-center">
                    <div className="rounded-full p-3 bg-ecstasy-100/50 mr-5">
                      <Trophy className="text-ecstasy" size={20} />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-xl">{achievement.name}</p>
                    <p className="text-sm text-gray-500">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="md:w-3/12 px-4 hidden md:block space-y-6 py-6 h-screen">
          <StudentInfo user={JSON.parse(JSON.stringify(user))} />
        </div>
      </div>
    </div>
  );
}
