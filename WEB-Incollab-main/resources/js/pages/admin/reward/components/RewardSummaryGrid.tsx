import { getSummaryCards } from '../constants';
import type { Summary } from '../types';
import { SummaryCard } from './SummaryCard';

export function RewardSummaryGrid({ summary }: { summary: Summary }) {
    return (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {getSummaryCards(summary).map((card) => (
                <SummaryCard key={card.label} {...card} />
            ))}
        </section>
    );
}
