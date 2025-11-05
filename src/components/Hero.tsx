import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-foreground">
            Every <span className="text-primary">developer</span> has a tab<br />
            open to DevOverFlow
          </h1>
          
          <div className="max-w-2xl mx-auto relative">
            <Input 
              placeholder="Search Your Answers Here..." 
              className="h-14 pl-6 pr-12 text-base rounded-full border-2 border-border shadow-sm"
            />
            <Button 
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-10 w-10"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-lg text-muted-foreground">
            Find the best answer to your technical questions
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-8">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground">1.2k+</div>
              <div className="text-sm text-muted-foreground mt-1">Questions solved &<br />understanding built</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground">350+</div>
              <div className="text-sm text-muted-foreground mt-1">Developers learning<br />since 2024</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground">95%</div>
              <div className="text-sm text-muted-foreground mt-1">From companies using<br />DevOverFlow for Teams</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground">5,000+</div>
              <div className="text-sm text-muted-foreground mt-1">DevOverFlow for Teams<br />instances active every day</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
