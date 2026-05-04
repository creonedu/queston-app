'use client';

export default function StatusBar() {
  return (
    <div
      className="flex justify-between items-end px-7 pb-2 font-semibold text-sm text-ink tracking-wide"
      style={{ height: '54px', flexShrink: 0 }}
    >
      <div>9:41</div>
      <div className="flex gap-1.5 items-center font-mono text-[11px]">
        <div className="inline-flex gap-[1.5px]">
          <span className="inline-block w-[3px] h-1 bg-ink rounded-[1px]" />
          <span className="inline-block w-[3px] h-1.5 bg-ink rounded-[1px]" />
          <span className="inline-block w-[3px] h-2 bg-ink rounded-[1px]" />
          <span className="inline-block w-[3px] h-[10px] bg-ink rounded-[1px]" />
        </div>
        <div className="ml-1">5G</div>
        <div className="w-[22px] h-[11px] border border-ink rounded-[3px] relative p-px">
          <div className="w-4/5 h-full bg-ink rounded-sm" />
          <span className="absolute -right-[3px] top-[3px] w-0.5 h-1 bg-ink rounded-r-sm" />
        </div>
      </div>
    </div>
  );
}
