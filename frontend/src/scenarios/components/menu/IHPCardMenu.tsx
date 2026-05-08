import { NodeName, Status } from 'Models/typed';
import * as React from 'react';
import { useState } from 'react';
import { actions } from 'Store/ducks/app/reducer';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import { v4 as uuid } from 'uuid';
import ConfirmDialog from '../dialogs/ConfirmDialog';
import ClickMenu from './ClickMenu';
import NodeMenuItems from './NodeMenuItems';
import { nodeById } from 'Store/ducks/data/selectors';
import { nodeTypeMapper } from 'Common/helper';

interface Props {
  nodeName: NodeName;
  ksId: string;
  id?: string;
  status: Status;
  isOpen?: (o: boolean) => void;
}

const IHPCardMenu: React.FC<Props> = ({
  ksId,
  nodeName,
  id,
  status,
  isOpen,
}) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const node = useAppSelector((state) => nodeById(state, parseInt(id ?? '0')));
  const [close, setClose] = useState<string>();
  const dispatch = useAppDispatch();

  const handleClose = () => {
    isOpen?.(false);
    setClose(uuid());
  };

  if (!id) {
    return null;
  }
  return (
    <>
      <ClickMenu
        id={id}
        nodeName={nodeName}
        close={close}
        isOpen={isOpen}
        menuItems={
          <NodeMenuItems
            handleClose={handleClose}
            nodeName={nodeName}
            ksId={ksId}
            setOpenConfirm={setOpenConfirm}
            status={status}
            id={id}
          />
        }
      />
      <ConfirmDialog
        title={`Radera ${nodeTypeMapper(nodeName).name}`}
        dialogContent={`Är du säker på att du vill radera ${
          nodeTypeMapper(nodeName).name
        } "${node?.name}" inklusive allt underliggande innehåll?`}
        open={openConfirm}
        handleClose={() => setOpenConfirm(false)}
        confirm={() => {
          dispatch(actions.deleteNode({ id, nodeName }));
          setOpenConfirm(false);
          handleClose();
        }}
      />
    </>
  );
};
export default IHPCardMenu;
