import { CommandData, CommandDataProps } from './CommandData';
import { Bash, BashProps } from './Bash';
import { CalderaCmd, CalderaCmdProps } from './CalderaCmd';
import { Elastic, ElasticProps } from './Elastic';
import { HttpApi_cmd, HttpApiProps } from './HttpApi';
import { Jupyter, JupyterProps } from './Jupyter';
import { Kestrel, KestrelProps } from './Kestrel';
import { Manual, ManualProps } from './Manual';
import { Openc2Http, Openc2HttpProps } from './Openc2Http';
import { Powershell, PowershellProps } from './Poweshell';
import { Sigma, SigmaProps } from './Sigma';
import { Ssh_cmd, SshProps } from './Ssh';
import { Yara, YaraProps } from './Yara';

export abstract class CommandDataFactory {
  static create(props: Partial<CommandDataProps>): CommandData {
    switch (props.type) {
      case 'bash':
        return new Bash(props as BashProps);
      case 'caldera-cmd':
        return new CalderaCmd(props as CalderaCmdProps);
      case 'elastic':
        return new Elastic(props as ElasticProps);
      case 'http-api':
        return new HttpApi_cmd(props as HttpApiProps);
      case 'jupyter':
        return new Jupyter(props as JupyterProps);
      case 'kestrel':
        return new Kestrel(props as KestrelProps);
      case 'manual':
        return new Manual(props as ManualProps);
      case 'openc2-http':
        return new Openc2Http(props as Openc2HttpProps);
      case 'powershell':
        return new Powershell(props as PowershellProps);
      case 'sigma':
        return new Sigma(props as SigmaProps);
      case 'ssh':
        return new Ssh_cmd(props as SshProps);
      case 'yara':
        return new Yara(props as YaraProps);
      default:
        return new CommandData(props as CommandDataProps);
    }
  }
}
