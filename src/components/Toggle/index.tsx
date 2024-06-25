interface Props {
  items: string[];
  subItems?: string[];
  active: string;
  setActive: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

const Toggle = (props: Props) => {
  const { items = ['Basic', 'Mid-Tier', 'Luxury'], subItems = ['70-100', '500-1500', '1000-20000'], active, setActive, className } = props;

  return (
    <>
      <div className={`nav-bar-toggle-container ${className ? className : ''}`}>
        <>
          {items.map((item, index) => (
            <div
              className={active === item.toLowerCase() ? 'active' : 'toggle-option-1'}
              key={index}
              onClick={() => {
                setActive(item.toLowerCase());
              }}
            >
              <span>{item}</span>
              <span>{subItems?.length > 0 ? '£' : ''}{subItems[index]}</span>
            </div>
          ))}
        </>
      </div>
    </>
  );
};

export default Toggle;
