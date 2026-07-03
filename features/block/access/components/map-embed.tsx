export default function MapEmbed({ address }: { address: string }) {
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <div className="h-80 w-full overflow-hidden rounded-md md:h-[420px]">
      <iframe
        title={`${address}の地図`}
        src={mapUrl}
        className="w-full h-full border-0"
        loading="lazy"
      />
    </div>
  );
}
