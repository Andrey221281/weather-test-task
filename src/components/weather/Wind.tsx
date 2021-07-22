import React from "react";
import { ArrowIcon } from "./ArrowIcon";
import { PressureIcon } from "./PressureIcon";

interface Props {
  windDirectionString?: string;
  speed?: number;
  pressure?: number;
  arrow?: number;
}

export const Wind: React.FunctionComponent<Props> = ({
  arrow,
  windDirectionString,
  speed,
  pressure,
}) => {
  return (
    <>
      <div className="flex items-center">
        <ArrowIcon
          style={{
            transform: `rotate(${arrow}deg)`,
          }}
        />
        <span className="ml-1">
          {speed?.toFixed(1)}m/s {windDirectionString}
        </span>
      </div>
      <div className="flex items-center">
        <PressureIcon className="ml-5" />
        <span className="ml-1">{pressure}hPa</span>
      </div>
    </>
  );
};
