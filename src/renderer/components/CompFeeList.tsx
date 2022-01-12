import { Button } from '@mui/material';

import { CompFeeItem, CompFeeItemProps } from './CompFeeItem';

export interface CompFeeListProps {
  items: CompFeeItemProps[];
  // addItem: (item: CompFeeItemProps) => void;
}

export const CompFeeList = (props: CompFeeListProps) => {
  return (
    <div id={'fees'}>
      <div id={'fee-add'}>
        <label htmlFor="contained-button-file">
          <input
            style={{ display: 'none' }}
            accept="image/*"
            id="contained-button-file"
            multiple
            type="file"
            onChange={(e) => {
              console.log(e.target.files);
            }}
          />
          <Button variant="contained" component="span">
            Upload
          </Button>
        </label>
      </div>

      <div id={'fee-list'}>
        {props.items.map((item) => (
          <CompFeeItem {...item} />
        ))}
      </div>
    </div>
  );
};

export default CompFeeList;
