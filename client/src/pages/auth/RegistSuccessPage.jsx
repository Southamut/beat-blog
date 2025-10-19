import { NavBar } from "../../components/Homepage";
import { useNavigate } from "react-router-dom";
import { CircleCheck } from "lucide-react";

export function RegistSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex justify-center items-center p-4 my-4 flex-grow">
        <div className="w-full max-w-2xl bg-brown-200 rounded-sm shadow-md px-3 sm:px-20 py-14">
          
          <div className="flex justify-center">
            <CircleCheck className="w-20 h-20 text-green" />
          </div>

          <h2 className="text-4xl font-semibold text-center mb-6 mt-4 text-foreground">
            Registration success
          </h2>

          <div className="flex justify-center">
            <button
              type="submit"
              onClick={() => navigate("/")}
              className="px-8 py-2 bg-foreground text-white rounded-full bg-brown-600 hover:bg-muted-foreground transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
