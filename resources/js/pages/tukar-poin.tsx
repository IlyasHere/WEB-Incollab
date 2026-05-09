import { useMemo, useState } from "react";
import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';



type RewardCategory = "Semua" | "Voucher" | "Merchandise" | "Sertifikat";

type RewardItem = {
  id: number;
  category: Exclude<RewardCategory, "Semua">;
  title: string;
  description: string[];
  points: string;
  stockLabel: string;
  stockTextColorClass: string;
  stockBadgeWidthClass: string;
  cardTitleColorClass: string;
  cardDescriptionColorClass: string;
  pointsWrapperClass: string;
  pointsTextColorClass: string;
  buttonLabel: string;
  buttonClassName: string;
  iconSrc: string;
  imageSrc: string;
  priceWidthClass: string;
};

type EventItem = {
  id: number;
  title: string[];
  subtitle: string;
  reward: string;
  iconSrc: string;
  iconWidthClass: string;
  iconHeightClass: string;
  rewardWidthClass: string;
};


const categories: RewardCategory[] = [
  "Semua",
  "Voucher",
  "Merchandise",
  "Sertifikat",
];

const rewards: RewardItem[] = [
  {
    id: 1,
    category: "Voucher",
    title: "Voucher…",
    description: ["Potongan harga untuk", "pembelian buku…"],
    points: "500",
    stockLabel: "Sisa 15",
    stockTextColorClass: "text-[#6610f2]",
    stockBadgeWidthClass: "w-[38.28px]",
    cardTitleColorClass: "text-[#1d1a25]",
    cardDescriptionColorClass: "text-[#494456]",
    pointsWrapperClass: "",
    pointsTextColorClass: "text-[#1d1a25]",
    buttonLabel: "Tukar Sekarang",
    buttonClassName: "bg-[#6610f2] text-white",
    iconSrc: "/images/poinIcon.svg",
    imageSrc: "/images/voucher.jpg",
    priceWidthClass: "w-[32.5px]",
  },
  {
    id: 2,
    category: "Merchandise",
    title: "T-Shirt InCollab…",
    description: ["Kaos premium edisi", "terbatas untuk…"],
    points: "1.200",
    stockLabel: "Sisa 5",
    stockTextColorClass: "text-[#6610f2]",
    stockBadgeWidthClass: "w-[33.44px]",
    cardTitleColorClass: "text-[#1d1a25]",
    cardDescriptionColorClass: "text-[#494456]",
    pointsWrapperClass: "",
    pointsTextColorClass: "text-[#1d1a25]",
    buttonLabel: "Tukar Sekarang",
    buttonClassName: "bg-[#6610f2] text-white",
    iconSrc: "/images/poinIcon.svg",
    imageSrc: "/images/voucher-kaos.jpg",
    priceWidthClass: "w-[44.72px]",
  },
  {
    id: 3,
    category: "Sertifikat",
    title: "Akses Kelas…",
    description: ["Akses tak terbatas ke", "seluruh materi…"],
    points: "800",
    stockLabel: "Stok Habis",
    stockTextColorClass: "text-[#7a7488]",
    stockBadgeWidthClass: "w-[62.56px]",
    cardTitleColorClass: "text-[#7a7488]",
    cardDescriptionColorClass: "text-[#7a7488]",
    pointsWrapperClass: "opacity-60",
    pointsTextColorClass: "text-[#7a7488]",
    buttonLabel: "Stok Habis",
    buttonClassName: "bg-[#f2ebfb] text-[#7a7488]",
    iconSrc: "/images/poinIcon.svg",
    imageSrc: "/images/voucher-sertif.jpg",
    priceWidthClass: "w-[32.78px]",
  },
];

const events: EventItem[] = [
  {
    id: 1,
    title: ["Review Jurnal", "AI"],
    subtitle: "Selesaikan…",
    reward: "+50",
    iconSrc: "/images/review-icon.svg",
    iconWidthClass: "w-[11.67px]",
    iconHeightClass: "h-[9.33px]",
    rewardWidthClass: "w-[23.45px]",
  },
  {
    id: 2,
    title: ["Diskusi", "Algoritma"],
    subtitle: "Berikan jawaban…",
    reward: "+25",
    iconSrc: "/images/discussion-icon.svg",
    iconWidthClass: "w-[11.67px]",
    iconHeightClass: "h-[11.67px]",
    rewardWidthClass: "w-[21.88px]",
  },
  {
    id: 3,
    title: ["Upload", "Catatan"],
    subtitle: "Bagikan catatan",
    reward: "+100",
    iconSrc: "/images/upload-icon.svg",
    iconWidthClass: "w-[9.33px]",
    iconHeightClass: "h-[11.67px]",
    rewardWidthClass: "w-[29.3px]",
  },
];

export const RewardsDashboardMainSection = (): JSX.Element => {
  const [activeCategory, setActiveCategory] = useState<RewardCategory>("Semua");

  const filteredRewards = useMemo(() => {
    if (activeCategory === "Semua") {
      return rewards;
    }
    return rewards.filter((reward) => reward.category === activeCategory);
  }, [activeCategory]);

  return (
    <section
      aria-label="Reward catalog"
      className="grid grid-cols-12 grid-rows-[724px] max-w-screen-xl w-[calc(100%_-_352px)] h-[724px] gap-8 absolute top-24 left-80"
    >
      <div className="relative row-[1_/_2] col-[1_/_9] w-[608px] h-[723.99px]">
        <div className="flex w-full h-[190px] items-center justify-between p-8 absolute top-0 left-0 rounded-xl bg-[linear-gradient(90deg,rgba(102,16,242,1)_0%,rgba(26,143,227,1)_100%)]">
          <div className="absolute w-full h-full top-0 left-0 bg-[#ffffff01] rounded-xl shadow-[0px_4px_20px_-4px_#6610f20a]" />
          <div className="relative z-[1] flex w-full items-start justify-between gap-6">
            <div className="inline-flex flex-col items-start gap-2 relative flex-[0_0_auto]">
              <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                <h1 className="relative flex items-center w-[240.34px] h-[39px] mt-[-1.00px] [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-white text-[32px] tracking-[-0.64px] leading-[38.4px] whitespace-nowrap">
                  Reward Catalog
                </h1>
              </div>
              <div className="flex flex-col max-w-md items-start relative w-full flex-[0_0_auto]">
                <p className="relative w-[327.03px] h-[72px] mt-[-1.00px] [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-[#ffffffcc] text-base tracking-[0] leading-6">
                  Tukarkan poin kolaborasi kamu dengan
                  <br />
                  berbagai reward menarik untuk mendukung
                  <br />
                  aktivitas akademikmu.
                </p>
              </div>
            </div>
            <div className="inline-flex flex-col items-center justify-center p-6 relative flex-[0_0_auto] bg-[#ffffff33] rounded-xl border border-solid border-[#ffffff4c] backdrop-blur-[2px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(2px)_brightness(100%)]">
              <div className="inline-flex pt-0 pb-1 px-0 flex-[0_0_auto] flex-col items-start relative">
                <div className="relative flex items-center w-[95.61px] h-6 mt-[-1.00px] [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-[#ffffffe6] text-base tracking-[0.80px] leading-6 whitespace-nowrap">
                  POIN KAMU
                </div>
              </div>
              <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
                <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                  <img
                    className="relative w-[25px] h-[25px]"
                    alt="Ikon poin"
                    src="/images/poinIcon.svg"
                  />
                </div>
                <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                  <div className="relative flex items-center w-[104.05px] h-12 mt-[-1.00px] [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-white text-[40px] tracking-[-0.80px] leading-[48px] whitespace-nowrap">
                    1.250
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex w-full h-10 items-center gap-3 pt-0 pb-2 px-0 absolute top-[222px] left-0"
          role="tablist"
          aria-label="Kategori reward"
        >
          {categories.map((category) => {
            const isActive = activeCategory === category;

            const widthClass =
              category === "Semua"
                ? "w-[46.81px]"
                : category === "Voucher"
                  ? "w-[56.55px]"
                  : category === "Merchandise"
                    ? "w-[87.44px]"
                    : "w-[62.06px]";

            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-pressed={isActive}
                onClick={() => setActiveCategory(category)}
                className={
                  isActive
                    ? "all-[unset] box-border inline-flex px-5 py-2 bg-[#6610f2] rounded-full shadow-[0px_1px_2px_#0000000d] flex-col items-center justify-center relative flex-[0_0_auto] cursor-pointer"
                    : "all-[unset] box-border inline-flex flex-col items-center justify-center px-5 py-2 relative flex-[0_0_auto] bg-white rounded-full border border-solid border-[#cbc3d9] cursor-pointer"
                }
              >
                <div
                  className={`relative flex items-center justify-center ${widthClass} h-3.5 [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-sm text-center tracking-[0] leading-[14px] whitespace-nowrap ${
                    isActive ? "mt-[-1.00px] text-white" : "text-[#494456]"
                  }`}
                >
                  {category}
                </div>
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-3 grid-rows-[301.88px] w-full h-[302px] gap-6 absolute top-[294px] left-0">
          {filteredRewards.map((reward, index) => (
            <article
              key={reward.id}
              className={`col-[${index + 1}_/_${index + 2}] relative row-[1_/_2] w-full h-fit flex flex-col items-start gap-4 p-4 bg-white rounded-xl border border-solid border-[#e7e0f0]`}
            >
              <div className="absolute w-full h-full top-0 left-0 bg-[#ffffff01] rounded-xl shadow-[0px_4px_20px_-4px_#6610f20a]" />
              <div className="flex flex-col items-start justify-center relative self-stretch w-full flex-[0_0_auto] bg-[#f2ebfb] rounded-lg overflow-hidden aspect-[1.78]">
                <div
                    className="relative self-stretch w-full h-[85px] bg-cover bg-center"
                    style={{ backgroundImage: `url(${reward.imageSrc})` }}
                />
                <div className="inline-flex flex-col items-start px-2 py-1 absolute top-2 right-2 bg-[#ffffffe6] rounded-md backdrop-blur-[2px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(2px)_brightness(100%)]">
                  <div
                    className={`relative flex items-center ${reward.stockBadgeWidthClass} h-4 mt-[-1.00px] [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal ${reward.stockTextColorClass} text-xs tracking-[0] leading-4 whitespace-nowrap`}
                  >
                    {reward.stockLabel}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                <div className="pt-0 pb-1 px-0 flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                    <h2
                      className={`relative flex items-center self-stretch mt-[-1.00px] [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal ${reward.cardTitleColorClass} text-lg tracking-[0] leading-7`}
                    >
                      {reward.title}
                    </h2>
                  </div>
                </div>
                <div className="flex flex-col items-start pt-0 pb-4 px-0 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                    <p
                      className={`relative self-stretch mt-[-1.00px] [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal ${reward.cardDescriptionColorClass} text-sm tracking-[0] leading-5`}
                    >
                      {reward.description[0]}
                      <br />
                      {reward.description[1]}
                    </p>
                  </div>
                </div>
                <div className="flex h-[44.02px] justify-end pt-[0.02px] pb-4 px-0 self-stretch w-full flex-col items-start relative">
                  <div className="flex items-center relative self-stretch w-full flex-[0_0_auto]">
                    <div
                      className={`inline-flex items-center gap-1.5 relative flex-[0_0_auto] ${reward.pointsWrapperClass}`}
                    >
                      <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                        <img
                          className="relative w-[16.67px] h-[16.67px]"
                          alt="Ikon poin"
                          src="/images/poinIcon.svg"
                        />
                      </div>
                      <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                        <div
                          className={`relative flex items-center ${reward.priceWidthClass} h-6 mt-[-1.00px] [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal ${reward.pointsTextColorClass} text-base tracking-[0] leading-6 whitespace-nowrap`}
                        >
                          {reward.points}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={reward.buttonLabel === "Stok Habis"}
                  className={`all-[unset] box-border flex px-0 py-2.5 self-stretch w-full rounded-lg flex-col items-center justify-center relative flex-[0_0_auto] ${reward.buttonClassName} ${
                    reward.buttonLabel === "Stok Habis"
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <div
                    className={`relative flex items-center justify-center ${
                      reward.buttonLabel === "Stok Habis"
                        ? "w-[72.47px]"
                        : "w-[102.84px]"
                    } h-3.5 mt-[-1.00px] [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-sm text-center tracking-[0] leading-[14px] whitespace-nowrap ${
                      reward.buttonLabel === "Stok Habis"
                        ? "text-[#7a7488]"
                        : "text-white"
                    }`}
                  >
                    {reward.buttonLabel}
                  </div>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
      <aside
        className="relative row-[1_/_2] col-[9_/_13] w-72 h-[682px]"
        aria-label="Ringkasan reward dan event"
      >
        <div className="absolute w-full top-0 left-0 h-[214px] bg-white rounded-xl border border-solid border-[#e7e0f0]">
          <div className="absolute w-full h-full top-0 left-0 bg-[#ffffff01] rounded-xl shadow-[0px_4px_20px_-4px_#6610f20a]" />
          <div className="flex w-[calc(100%_-_50px)] h-7 items-center justify-between absolute top-[25px] left-[25px]">
            <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
              <h2 className="relative flex items-center w-[131.5px] h-7 mt-[-1.00px] [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-[#1d1a25] text-lg tracking-[0] leading-7 whitespace-nowrap">
                Ringkasan Poin
              </h2>
            </div>
            <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
              <img
                className="relative w-5 h-5"
                alt="Informasi ringkasan poin"
                src="/images/info.svg"
              />
            </div>
          </div>
          <div className="flex w-[calc(100%_-_50px)] h-14 items-center gap-3 absolute top-[73px] left-[25px]">
            <div className="flex w-12 h-12 justify-center items-center relative bg-[#e6c2291a] rounded-full">
              <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                <img
                  className="relative w-[25px] h-[25px]"
                  alt="Ikon poin aktif"
                  src="/images/poinIcon.svg"
                />
              </div>
            </div>
            <div className="inline-flex flex-col items-start gap-1 relative flex-[0_0_auto]">
              <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                <div className="relative flex items-center w-[83.23px] h-8 mt-[-1.00px] [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-[#1d1a25] text-[32px] tracking-[-0.64px] leading-8 whitespace-nowrap">
                  1.250
                </div>
              </div>
              <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                <div className="relative flex items-center w-[62.45px] h-5 mt-[-1.00px] [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-[#494456] text-sm tracking-[0] leading-5 whitespace-nowrap">
                  Poin Aktif
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute w-full top-[238px] left-0 h-[444px] bg-white rounded-xl border border-solid border-[#e7e0f0]">
          <div className="absolute w-full h-full top-0 left-0 bg-[#ffffff01] rounded-xl shadow-[0px_4px_20px_-4px_#6610f20a]" />
          <div className="flex flex-col w-[calc(100%_-_50px)] items-start pt-0 pb-2 px-0 absolute top-[25px] left-[25px]">
            <div className="flex self-stretch w-full flex-col items-start relative flex-[0_0_auto]">
              <h2 className="relative self-stretch mt-[-1.00px] [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-[#1d1a25] text-lg tracking-[0] leading-7">
                Event Aktif Menghasilkan
                <br />
                Poin
              </h2>
            </div>
          </div>
          <div className="flex flex-col w-[calc(100%_-_50px)] items-start gap-4 absolute top-[105px] left-[25px]">
            {events.map((event) => (
              <article
                key={event.id}
                className="flex items-start justify-between p-3 relative self-stretch w-full flex-[0_0_auto] rounded-lg border border-solid border-[#e7e0f0]"
              >
                <div className="inline-flex items-start gap-3 relative flex-[0_0_auto]">
                  <div className="inline-flex pt-0.5 pb-0 px-0 flex-[0_0_auto] flex-col items-start relative">
                    <div className="inline-flex flex-col items-start p-2 relative flex-[0_0_auto] bg-[#6610f21a] rounded-md">
                      <img
                        className={`relative ${event.iconWidthClass} ${event.iconHeightClass}`}
                        alt=""
                        aria-hidden="true"
                        src={event.iconSrc}
                      />
                    </div>
                  </div>
                  <div className="inline-flex flex-col items-start gap-1 relative flex-[0_0_auto]">
                    <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                      <div className="relative h-12 mt-[-1.00px] [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-[#1d1a25] text-base tracking-[0] leading-6">
                        {event.title[0]}
                        <br />
                        {event.title[1]}
                      </div>
                    </div>
                    <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                      <div
                        className={`relative flex items-center ${
                          event.id === 1
                            ? "w-[69.53px]"
                            : event.id === 2
                              ? "w-[100.64px]"
                              : "w-[92.97px]"
                        } h-4 mt-[-1.00px] [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-[#494456] text-xs tracking-[0] leading-4 whitespace-nowrap overflow-hidden text-ellipsis`}
                      >
                        {event.subtitle}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`inline-flex ${
                    event.id === 3 ? "gap-[3.99px]" : "gap-1"
                  } px-2 py-1 flex-[0_0_auto] items-center relative bg-[#e6c2291a] rounded-full`}
                >
                  <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                    <img
                      className="relative w-[11.67px] h-[11.67px]"
                      alt=""
                      aria-hidden="true"
                      src={
                        event.id === 1 ? "/images/poinIcon.svg" : event.id === 2 ? "/images/poinIcon.svg" : "/images/poinIcon.svg"
                      }
                    />
                  </div>
                  <div
                    className={`relative flex items-center ${event.rewardWidthClass} h-4 mt-[-1.00px] [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-[#746000] text-xs tracking-[0] leading-4 whitespace-nowrap`}
                  >
                    {event.reward}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
};

export default function TukarPoin() {
    return (
        <>
            <Head title="Tukar Poin" />
            <main className="px-4 py-5 pb-28 sm:px-6 sm:py-6 md:pb-8 lg:px-8 xl:px-10">
                <div className="mx-auto max-w-[1320px]">
                    <RewardsDashboardMainSection />
                </div>
            </main>
        </>
    );

}

TukarPoin.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
