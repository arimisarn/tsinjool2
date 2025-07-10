import { Calendar, Bell, Brain } from "lucide-react";
import pic from "../../assets/avatar.jpg";
import DarkMode from "../theme/DarkMode";
const MainHeader: React.FC = () => {
  const daty: Date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const formatDate: string = daty.toLocaleDateString("fr-FR", options);

  const dateParts: string[] = formatDate.split(" ");
  const ordreDate: string = `${dateParts[0]}
  ${dateParts[1]}
  ${dateParts[2]}     
  ${dateParts[3]}`;
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground transition-colors duration-300">
              Tsinjool
            </h1>
            <p className="text-sm text-muted-foreground transition-colors duration-300">
              Votre coach personnel intelligent
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Démo 0/7 jours
          </div>
          <div className="flex items-center gap-2">
            <DarkMode />
            <div className="flex items-center gap-1 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{ordreDate}</span>
              <Bell className="w-5 h-5" />
              <img
                src={pic}
                className="w-8 h-8 rounded-full border-2 border-zinc-500 dark:bg-zinc-800 dark:border-zinc-100 cursor-pointer "
                alt="Profil utilisateur"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
