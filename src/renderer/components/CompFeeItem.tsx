export interface CompFeeItemProps {
  name: string;

  date: Date;

  imgSrc: string;

  expanded: boolean;
}

export const CompFeeItem = (props: CompFeeItemProps) => {
  return (
    <div>
      <div className={'fee-header'}>
        <p>{props.name}</p>
        <p>{props.date}</p>
      </div>

      <div className={'fee-content'} style={{ visibility: props.expanded ? 'visible' : 'hidden' }}>
        <img src={props.imgSrc} />
      </div>
    </div>
  );
};

export default CompFeeItem;
