interface PlaceholderPageProps {
  title: string;
  description: string;
}

const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-3 text-sm text-slate-600">{description}</p>
    </div>
  );
};

export default PlaceholderPage;
