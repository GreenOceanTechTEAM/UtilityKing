import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Scale, Bot, CheckSquare, ShieldCheck, MousePointerClick, Users, Euro, Smile } from 'lucide-react';
import AnimatedNumber from '../shared/animated-number';

type WhyUtilityKingProps = {
  id: string;
};

const values = [
  {
    icon: <Scale className="h-8 w-8 text-accent" />,
    title: "100% Impartial",
    description: "Our recommendations are based purely on data and what's best for you, not on commissions."
  },
  {
    icon: <Bot className="h-8 w-8 text-accent" />,
    title: "AI Powered by Gemini",
    description: "Our smart assistant, UKi, is always available to answer your questions and guide you."
  },
  {
    icon: <MousePointerClick className="h-8 w-8 text-accent" />,
    title: "One-Click Switching",
    description: "Our streamlined process makes switching providers quick and hassle-free."
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-accent" />,
    title: "GDPR & Data Safe",
    description: "Your privacy is paramount. We follow the strictest data protection standards."
  },
  {
    icon: <CheckSquare className="h-8 w-8 text-accent" />,
    title: "Free to Use",
    description: "Our comparison service is completely free, with no obligation to switch."
  }
];

const stats = [
    { value: 10000, label: "Trusted UK Users", suffix: "+", icon: <Users className="h-8 w-8 text-muted-foreground" /> },
    { value: 284, label: "Average Annual Savings", prefix: "£", icon: <Euro className="h-8 w-8 text-muted-foreground" /> },
    { value: 98, label: "Customer Satisfaction", suffix: "%", icon: <Smile className="h-8 w-8 text-muted-foreground" /> }
];

export default function WhyUtilityKing({ id }: WhyUtilityKingProps) {
  return (
    <section id={id} className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            The Utility King Difference
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            We're not just another comparison site. We're a technology company dedicated to making the utility market fair and transparent for everyone.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {values.slice(0, 3).map((value) => (
             <Card key={value.title} className="bg-transparent border-0 shadow-none hover:bg-muted/30 transition-colors">
                 <CardHeader className="flex flex-row items-start gap-4 p-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-accent">
                        {value.icon}
                    </div>
                    <div>
                        <CardTitle className="text-lg leading-6">{value.title}</CardTitle>
                        <CardDescription className="mt-2 text-base">{value.description}</CardDescription>
                    </div>
                </CardHeader>
            </Card>
          ))}
        </div>
         <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {values.slice(3).map((value) => (
             <Card key={value.title} className="bg-transparent border-0 shadow-none hover:bg-muted/30 transition-colors md:col-start-1 md:last:col-start-2 lg:col-start-auto lg:last:col-start-auto">
                 <CardHeader className="flex flex-row items-start gap-4 p-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-accent">
                        {value.icon}
                    </div>
                    <div>
                        <CardTitle className="text-lg leading-6">{value.title}</CardTitle>
                        <CardDescription className="mt-2 text-base">{value.description}</CardDescription>
                    </div>
                </CardHeader>
            </Card>
          ))}
        </div>
        
        <div className="mt-20">
             <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.label} className="text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg">
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        {stat.icon}
                        <p className="text-5xl font-bold font-headline text-primary mt-4">
                            <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                        </p>
                        <p className="text-lg text-muted-foreground mt-2">
                            {stat.label}
                        </p>
                      </CardContent>
                    </Card>
                ))}
             </div>
        </div>
      </div>
    </section>
  );
}
