export default function CheckoutSummaryFooterRow({
  heading,
  value,
  grandTotal,
}: {
  heading: string;
  value: string;
  grandTotal?: boolean;
}): React.ReactElement {
  return (
    <div
      className={`flex justify-between items-center ${
        grandTotal ? 'mt-6' : ''
      }`}
    >
      <span className="text-text text-lg  opacity-50">{heading}</span>
      <span
        className={` font-bold text-lg ${
          grandTotal ? 'text-accent  inline-block' : ' text-text'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
