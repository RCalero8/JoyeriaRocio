export default function CategoryTabs({ categories, active, onChange }) {
  return (
    <div className="category-tabs">
      <button
        type="button"
        className={active === null ? 'active' : ''}
        onClick={() => onChange(null)}
      >
        Todas
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          className={active === cat.id ? 'active' : ''}
          onClick={() => onChange(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}