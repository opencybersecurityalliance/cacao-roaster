import { Shape, ShapeLike, Element } from 'diagram-js/lib/model/Types';
import CacaoElement, { CacaoConstructType } from '../CacaoBaseConstruct';
import { CacaoConnectionType } from '../../connections/CacaoBaseConnection';
import { WorkflowStep } from '../../../../../lib/cacao2-js/src/workflows/WorkflowStep';
import { DrawFactory, DrawProps } from '../../../modules/draw/DrawFactory';
import { ActionStep } from 'lib/cacao2-js/src/workflows/ActionStep';
import { CommandData } from 'lib/cacao2-js/src/commands/CommandData';
import PlaybookHandler from '../../../modules/model/PlaybookHandler';
import { AgentTarget } from 'lib/cacao2-js';
import CacaoUtils from '../../../modules/core/CacaoUtils';

export default class CacaoActionConstruct extends CacaoElement {
  backgroundColor = 'white';
  borderColor = '#006080';
  textColor = '#28293E';

  headerBackgroundColor = '#6BB8D0';
  headerTextColor = 'white';

  commandBackgroundColor = '#F1F6FF';
  commandBorderColor = '#6E86AF';
  commandTextColor = '#006080';

  MAX_COMMANDS_DISPLAYED = 3;

  constructor(shape: Shape | ShapeLike | Element | undefined) {
    super(shape, CacaoConstructType.ACTION_STEP, {
      modelType: 'action',
      className: 'action-step',
      title: 'Action step',
      width: 150,
      height: 60,
      resizable: false,
      incomingConnectionAllowed: Object.values(CacaoConnectionType),
      outgoingConnectionAllowed: [
        CacaoConnectionType.ON_COMPLETION,
        CacaoConnectionType.ON_FAILURE,
        CacaoConnectionType.ON_SUCCESS,
      ],
    });
  }

  override drawConstruct(
    visuals: SVGElement,
    shape: Shape,
    workflowStep: WorkflowStep,
    playbookHandler: PlaybookHandler,
  ): SVGElement {
    let propsList: DrawProps[] = [];
    let actionStep = workflowStep as ActionStep;
    let visualHeight = shape.height;

    propsList.push(
      ...this.getPrincipalShapeProps(
        shape,
        actionStep,
        this.borderColor,
        this.headerBackgroundColor,
      ),
    );
    if (CacaoUtils.isDefined(shape.collapsed) && !shape.collapsed) {
      //add command tile
      let commandHeight: number;
      let commandShapeProps: DrawProps[];
      [commandShapeProps, commandHeight] = this.getCommandsShapeProps(
        visualHeight + 10,
        shape,
        actionStep,
      );
      propsList.push(...commandShapeProps);
      visualHeight += commandHeight + 10;

      //add agent target tile
      let agentTargetsHeight: number;
      let agentTargetsShapeProps: DrawProps[];
      [agentTargetsShapeProps, agentTargetsHeight] =
        this.getAgentTargetsShapeProps(
          visualHeight + 10,
          shape,
          actionStep,
          playbookHandler,
        );
      propsList.push(...agentTargetsShapeProps);
      visualHeight += agentTargetsHeight + 10;

      propsList.splice(1, 0, {
        type: 'rectangle',
        x: -5,
        y: -5,
        width: shape.width + 10,
        height: visualHeight + 10,
        styleAttrs: {
          fill: '#FFFFFF',
          fillOpacity: 0.6,
          stroke: '#D6D6D6',
        },
      });
    }

    propsList.push(
      this.getExecutionStatusDotProps(
        shape,
        playbookHandler.getShapeStatus(shape.id),
      ),
    );

    DrawFactory.drawAll(visuals, propsList);
    return visuals;
  }

  /**
   * this method return the props to render the command tile when the expanded mode is activated in the canvas
   * @param posY
   * @param shape
   * @param workflowStep
   * @returns
   */
  getCommandsShapeProps(
    posY: number,
    shape: Shape,
    workflowStep: ActionStep,
  ): [DrawProps[], number] {
    let top = posY;

    let opacity = 0.6;

    posY += 15;
    let commandPropsList = [];

    let background = (top: number, height: number): DrawProps => {
      return {
        type: 'rectangle',
        x: 0,
        y: top,
        width: shape.width,
        height: height,
        styleAttrs: {
          fill: this.backgroundColor,
          stroke: this.borderColor,
          fillOpacity: opacity,
          strokeOpacity: opacity,
        },
      };
    };

    let title: DrawProps = {
      type: 'text',
      x: 5,
      y: top + 5,
      width: shape.width - 10,
      height: 8,
      title: 'Commands',
      numberOfLine: 1,
      styleAttrs: {
        fill: this.textColor,
        fontWeight: 'bold',
        strokeOpacity: 0,
        fontSize: 8,
        align: 'center-top',
        fillOpacity: opacity,
      },
    };

    let command = (
      y: number,
      command: Partial<CommandData>,
    ): [DrawProps[], number] => {
      let propsList: DrawProps[] = [];
      let yIndex = y;
      let horizontalMargin = 5;
      let horizontalPadding = 10;

      yIndex += 5;
      propsList.push({
        type: 'text',
        x: horizontalPadding,
        y: yIndex,
        width: shape.width - horizontalPadding * 2,
        height: 10,
        title: this.filterCommandType(command.type),
        numberOfLine: 1,
        styleAttrs: {
          fill: this.commandTextColor,
          strokeOpacity: 0,
          fontSize: 10,
          align: 'left-top',
          fontWeight: '600',
          fillOpacity: opacity,
        },
      });
      yIndex += 10;

      if (command.playbook_activity) {
        yIndex += 3;
        propsList.push({
          type: 'text',
          x: horizontalPadding,
          y: yIndex,
          width: shape.width - horizontalPadding * 2,
          height: 10,
          title: command.playbook_activity,
          numberOfLine: 1,
          styleAttrs: {
            fill: this.commandTextColor,
            strokeOpacity: 0,
            fontSize: 8,
            fontStyle: 'italic',
            align: 'left-top',
            fontWeight: '500',
            fillOpacity: opacity,
          },
        });
        yIndex += 8;
      }

      if (command.description) {
        yIndex += 3;
        propsList.push({
          type: 'text',
          x: horizontalPadding,
          y: yIndex,
          width: shape.width - horizontalPadding * 2,
          height: 10,
          title: command.description,
          numberOfLine: 1,
          styleAttrs: {
            fill: this.commandTextColor,
            strokeOpacity: 0,
            fontSize: 8,
            align: 'left-top',
            fontWeight: '200',
            fillOpacity: opacity,
          },
        });
        yIndex += 8;
      }

      yIndex += 5;
      propsList.splice(0, 0, {
        type: 'rectangle',
        x: horizontalMargin,
        y: y,
        width: shape.width - horizontalMargin * 2,
        height: yIndex - y,
        styleAttrs: {
          strokeWidth: 0.5,
          stroke: this.commandBorderColor,
          fill: this.commandBackgroundColor,
          rx: 4,
          ry: 4,
          fillOpacity: opacity,
          strokeOpacity: opacity,
        },
      });

      return [propsList, yIndex - y];
    };

    let AddMoreProps = (name: string, posY: number): DrawProps => {
      return {
        type: 'text',
        x: 5,
        y: posY,
        width: shape.width - 10,
        height: 8,
        title: name,
        numberOfLine: 1,
        styleAttrs: {
          fill: this.textColor,
          strokeOpacity: 0,
          fontSize: 8,
          align: 'center-top',
          fillOpacity: opacity,
        },
      };
    };

    for (
      let index = 0;
      workflowStep?.commands &&
      index < workflowStep.commands.length &&
      index < this.MAX_COMMANDS_DISPLAYED;
      index++
    ) {
      let commandData = workflowStep.commands[index];
      let commandProps: DrawProps[];
      let commandHeight: number;
      [commandProps, commandHeight] = command(posY, commandData);
      commandPropsList.push(...commandProps);
      posY += 5 + commandHeight;
    }

    if (workflowStep?.commands?.length > this.MAX_COMMANDS_DISPLAYED) {
      let number = workflowStep.commands.length - this.MAX_COMMANDS_DISPLAYED;
      let name = '';
      if (number == 1) {
        name = '1 more command';
      } else {
        name = number + ' more commands';
      }
      commandPropsList.push(AddMoreProps(name, posY));
      posY += 10;
    } else if (workflowStep?.commands?.length == 0) {
      posY += 5;
      commandPropsList.push(AddMoreProps('no command defined', posY));
      posY += 15;
    }

    return [
      [background(top, posY - top), title, ...commandPropsList],
      posY - top,
    ];
  }

  /**
   * this method return the props to render the command tile when the expanded mode is activated in the canvas
   * @param posY
   * @param shape
   * @param workflowStep
   * @returns
   */
  getAgentTargetsShapeProps(
    posY: number,
    shape: Shape,
    workflowStep: ActionStep,
    playbookHandler: PlaybookHandler,
  ): [DrawProps[], number] {
    let top = posY;

    let opacity = 0.6;

    let agentTargetPropsList: DrawProps[] = [];

    let AddMoreProps = (name: string, posY: number): DrawProps => {
      return {
        type: 'text',
        x: 5,
        y: posY,
        width: shape.width - 10,
        height: 8,
        title: name,
        numberOfLine: 1,
        styleAttrs: {
          fill: this.textColor,
          strokeOpacity: 0,
          fontSize: 8,
          align: 'center-top',
          fillOpacity: opacity,
        },
      };
    };

    let background = (top: number, height: number): DrawProps => {
      return {
        type: 'rectangle',
        x: 0,
        y: top,
        width: shape.width,
        height: height,
        styleAttrs: {
          fill: this.backgroundColor,
          stroke: this.borderColor,
          fillOpacity: opacity,
          strokeOpacity: opacity,
        },
      };
    };

    let agentTarget = (
      y: number,
      agentTarget: AgentTarget,
    ): [DrawProps[], number] => {
      let propsList: DrawProps[] = [];
      let yIndex = y;
      let horizontalMargin = 5;
      let horizontalPadding = 10;

      yIndex += 5;
      propsList.push({
        type: 'text',
        x: horizontalPadding,
        y: yIndex,
        width: shape.width - horizontalPadding * 2,
        height: 10,
        title: agentTarget.type,
        numberOfLine: 1,
        styleAttrs: {
          fill: this.commandTextColor,
          strokeOpacity: 0,
          fontSize: 10,
          align: 'left-top',
          fontWeight: '600',
          fillOpacity: opacity,
        },
      });
      yIndex += 10;

      if (agentTarget.name) {
        yIndex += 3;
        propsList.push({
          type: 'text',
          x: horizontalPadding,
          y: yIndex,
          width: shape.width - horizontalPadding * 2,
          height: 10,
          title: agentTarget.name,
          numberOfLine: 1,
          styleAttrs: {
            fill: this.commandTextColor,
            strokeOpacity: 0,
            fontSize: 8,
            align: 'left-top',
            fontWeight: '200',
            fillOpacity: opacity,
          },
        });
        yIndex += 8;
      }

      yIndex += 5;
      propsList.splice(0, 0, {
        type: 'rectangle',
        x: horizontalMargin,
        y: y,
        width: shape.width - horizontalMargin * 2,
        height: yIndex - y,
        styleAttrs: {
          strokeWidth: 0.5,
          stroke: this.commandBorderColor,
          fill: this.commandBackgroundColor,
          rx: 4,
          ry: 4,
          fillOpacity: opacity,
          strokeOpacity: opacity,
        },
      });

      return [propsList, yIndex - y];
    };

    let titleAgent: DrawProps = {
      type: 'text',
      x: 5,
      y: top + 5,
      width: shape.width - 10,
      height: 8,
      title: 'Agent',
      numberOfLine: 1,
      styleAttrs: {
        fill: this.textColor,
        fontWeight: 'bold',
        strokeOpacity: 0,
        fontSize: 8,
        align: 'center-top',
        fillOpacity: opacity,
      },
    };
    agentTargetPropsList.push(titleAgent);
    posY += 15;

    //show agent
    if (CacaoUtils.isDefined(workflowStep.agent)) {
      let agent = playbookHandler.getAgent(workflowStep.agent);
      if (agent == undefined)
        throw Error(
          'a step refer to an agent that is not existing in the playbook',
        );

      let titleAgent: DrawProps = {
        type: 'text',
        x: 5,
        y: top + 5,
        width: shape.width - 10,
        height: 8,
        title: 'Agent',
        numberOfLine: 1,
        styleAttrs: {
          fill: this.textColor,
          fontWeight: 'bold',
          strokeOpacity: 0,
          fontSize: 8,
          align: 'center-top',
          fillOpacity: opacity,
        },
      };

      agentTargetPropsList.push(titleAgent);
      let agentProps;
      let agentHeight;
      [agentProps, agentHeight] = agentTarget(posY, agent as AgentTarget);
      agentTargetPropsList.push(...agentProps);
      posY += agentHeight;
    } else {
      posY += 5;
      agentTargetPropsList.push(AddMoreProps('no agent defined', posY));
      posY += 15;
    }

    let titleTarget: DrawProps = {
      type: 'text',
      x: 5,
      y: posY + 5,
      width: shape.width - 10,
      height: 8,
      title: 'Targets',
      numberOfLine: 1,
      styleAttrs: {
        fill: this.textColor,
        fontWeight: 'bold',
        strokeOpacity: 0,
        fontSize: 8,
        align: 'center-top',
        fillOpacity: opacity,
      },
    };

    agentTargetPropsList.push(titleTarget);
    posY += 15; //height of text "targets" + margin bottom/top

    //show targets
    if (workflowStep.targets?.length != 0) {
      let count = 0;
      for (let targetId of workflowStep.targets) {
        if (count >= this.MAX_COMMANDS_DISPLAYED) break;

        let target = playbookHandler.getTarget(targetId);
        if (target == undefined)
          throw Error(
            'a step refer to a target that is not existing in the playbook',
          );

        let targetProps;
        let targetHeight;
        [targetProps, targetHeight] = agentTarget(posY, target as AgentTarget);
        agentTargetPropsList.push(...targetProps);
        posY += 5 + targetHeight;
        count++;
      }

      if (workflowStep?.targets?.length > this.MAX_COMMANDS_DISPLAYED) {
        let number = workflowStep.targets.length - this.MAX_COMMANDS_DISPLAYED;
        let name = '';
        if (number == 1) {
          name = '1 more target';
        } else {
          name = number + ' more targets';
        }
        agentTargetPropsList.push(AddMoreProps(name, posY));
        posY += 10;
      }
    } else {
      posY += 5;
      agentTargetPropsList.push(AddMoreProps('no target defined', posY));
      posY += 15;
    }

    return [[background(top, posY - top), ...agentTargetPropsList], posY - top];
  }

  filterCommandType(commandType: string | undefined): string | undefined {
    if (commandType && commandType.endsWith('_cmd')) {
      return commandType.replace('_cmd', '');
    }
    return commandType;
  }
}
