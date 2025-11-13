import { FileText, BarChart3, Smile } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';

type HowItWorksProps = {
  id: string;
};

const steps = [
  {
    icon: <FileText className="h-10 w-10 text-accent" />,
    title: "Step 1: Tell Us About You",
    description: "Provide a few details about your current usage, location, and what you're looking for in a new plan."
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-accent" />,
    title: "Step 2: Compare Deals",
    description: "Our AI, UKi, instantly analyzes thousands of deals to find the perfect matches for you, showing clear savings."
  },
  {
    icon: <Smile className="h-10 w-10 text-accent" />,
    title: "Step 3: Switch & Save",
    description: "Choose your new plan, and we'll handle the switch. It's a seamless process, and you start saving money."
  }
];

export default function HowItWorks({ id }: HowItWorksProps) {
  return (
    <section id={id} className="py-16 sm:py-24 bg-primary/5 dark:bg-primary/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Saving Money is as Easy as 1-2-3
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Our streamlined process makes finding a better utility deal simpler than ever before.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={index} className="text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/20">
              <CardHeader className="items-center p-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 mb-4">
                  {step.icon}
                </div>
                <CardTitle>{step.title}</CardTitle>
                <CardDescription className="pt-2">{step.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
