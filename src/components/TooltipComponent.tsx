import { StyleSheet, Text, View } from "react-native";
import React, { FC, memo } from "react";
import Tooltip from "react-native-walkthrough-tooltip";
import { COLORS } from "../constants/color";

interface IProps {
  isVisible?: boolean;
  onRequestClose?: () => void;
  content?: any;
  childrent?: any;
}

const TooltipComponent: FC<IProps> = ({
  isVisible,
  onRequestClose = () => {},
  content,
  children,
}) => {
  return (
    <>
      <Tooltip
        isVisible={isVisible}
        content={content}
        placement="top"
        onClose={onRequestClose}
        backgroundColor={COLORS.White}
        
      >
        {children}
      </Tooltip>
    </>
  );
};

export default memo(TooltipComponent);

const styles = StyleSheet.create({});
