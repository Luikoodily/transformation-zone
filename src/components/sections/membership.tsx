import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { membershipServicesNote } from "@/data/membership";
import { whatsappUrl } from "@/data/location";
import { formatINR } from "@/lib/format";
import { prisma } from "@/lib/prisma";

async function loadPlans() {
  try {
    return await prisma.membershipPlan.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
  } catch {
    return [];
  }
}

export async function Membership() {
  const plans = await loadPlans();
  if (plans.length === 0) return null;

  return (
    <section id="membership" className="bg-dark px-6 py-16 md:px-14 md:py-[120px]">
      <SectionLabel onDark className="mb-2">
        Membership
      </SectionLabel>
      <h2 className="mb-8 font-display text-3xl text-stone-text md:mb-12 md:text-[56px]">
        Push harder. Pay once.
      </h2>

      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="flex items-center justify-between gap-4 border border-dark-line p-6 md:p-8"
          >
            <div>
              <p className="font-display text-lg text-stone-text md:text-2xl">{plan.title}</p>
              {plan.note && (
                <p className="mt-1 font-body text-[11px] font-bold tracking-wider text-accent uppercase">
                  {plan.note}
                </p>
              )}
            </div>
            <p className="font-display text-2xl whitespace-nowrap text-accent md:text-4xl">
              {formatINR(plan.amount)}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-6 font-body text-[11.5px] text-[#B9AF98] md:mt-8 md:text-sm">
        {membershipServicesNote}
      </p>

      <Button
        href={whatsappUrl("Hi, I'd like to know more about membership plans.")}
        className="mt-8 md:mt-10"
      >
        Ask About Membership
      </Button>
    </section>
  );
}
