export function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[720px] bg-grid" />
      <div className="absolute -top-40 -left-24 size-[480px] bg-brand/35 blob animate-float" />
      <div className="absolute top-1/3 -right-32 size-[520px] bg-accent/20 blob animate-float [animation-delay:-3s]" />
      <div className="absolute bottom-0 left-1/3 size-[420px] bg-brand/20 blob" />
    </div>
  );
}
