const stats = [
  { value: "25M+", label: "Households use our products daily" },
  { value: "4B+", label: "Packs sold each year" },
  { value: "1M+", label: "Retail outlets across India" },
  { value: "80+", label: "Countries worldwide" },
  { value: "75+", label: "Pure & blended spice varieties" },
  { value: "10x", label: "Superbrand status achieved" },
];

const StatsSection = () => {
  return (
    <section className="py-16 md:py-20 bg-spice-brown relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-spice-gold rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-spice-red rounded-full blur-3xl" />
      </div>
      <div className="container relative">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
            A Taste of Our Legacy!
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-spice-gold mb-2">
                {stat.value}
              </p>
              <p className="font-body text-primary-foreground/70 text-xs md:text-sm leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
