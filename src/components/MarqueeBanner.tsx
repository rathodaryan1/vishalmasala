const MarqueeBanner = () => {
  const text = "#TasteMeinBest  •  VishalMasala  •  ";
  const repeated = text.repeat(12);

  return (
    <div className="bg-primary py-3 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap">
        <span className="font-display text-lg font-bold text-primary-foreground tracking-wide">
          {repeated}
        </span>
      </div>
    </div>
  );
};

export default MarqueeBanner;
