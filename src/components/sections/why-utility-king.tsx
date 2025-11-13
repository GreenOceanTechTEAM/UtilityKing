import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Scale, Database, Bot, Radio, CircleDollarSign, CheckSquare, ShieldCheck, MousePointerClick } from 'lucide-react';
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
    icon: <Database className="h-8 w-8 text-accent" />,
    title: "Backed by Data",
    description: "We analyze millions of data points to ensure our comparisons are accurate and up-to-date."
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
    { value: 10000, label: "Trusted UK Users", suffix: "+" },
    { value: 284, label: "Average Annual Savings", prefix: "£" },
    { value: 98, label: "Customer Satisfaction", suffix: "%" }
];

export default function WhyUtilityKing({ id }: WhyUtilityKingProps) {
  return (
    <section id={id} className="py-16 sm:py-24 bg-primary/5 dark:bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            The Utility King Difference
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            We're not just another comparison site. We're a technology company dedicated to making the utility market fair and transparent for everyone.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="flex gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
                {value.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold leading-6 text-foreground">{value.title}</h3>
                <p className="mt-2 text-base text-muted-foreground">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20">
             <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.label} className="text-center bg-transparent border-0 md:border-l first:border-l-0">
                        <CardHeader>
                            <CardTitle className="text-5xl font-bold font-headline text-primary">
                                <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                            </CardTitle>
                            <CardDescription className="text-lg">
                                {stat.label}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ))}
             </div>
        </div>
      </div>
    </section>
  );
}
