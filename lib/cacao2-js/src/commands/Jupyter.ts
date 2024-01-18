import { CommandData, CommandDataProps } from './CommandData';

export interface JupyterProps extends CommandDataProps {
  command_b64: string;
}

export interface Jupyter extends JupyterProps {}
export class Jupyter extends CommandData {
  constructor(partialprops: Partial<JupyterProps> = {}) {
    const props: JupyterProps = partialprops as JupyterProps;
    super(props);
    this.type = 'jupyter';
    this.command_b64 = props.command_b64;
  }
}
