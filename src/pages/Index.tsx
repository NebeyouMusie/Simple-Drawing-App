import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-pink-50 animate-fade-in font-poppins">
      <div className="container px-4 mx-auto">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Simple Drawing App
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create your own sketches online with our intuitive drawing tools!
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/draw")}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full transition-all hover:scale-105"
          >
            Start Drawing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;