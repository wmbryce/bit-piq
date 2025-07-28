import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const validateHexInput = (input: string) => /^[0-9A-Fa-f]$/.test(input);

const hexToBinary = (hex: string): string[] => {
  const binary = parseInt(hex, 16).toString(2).padStart(4, "0");
  return binary.split("");
};

const binaryToHex = (binary: string[]): string => {
  const binaryStr = binary.join("");
  return parseInt(binaryStr, 2).toString(16).toUpperCase();
};

enum HashPickerMode {
  BIN = "BIN",
  HEX = "HEX",
}

type HashPickerProps = {
  setHashPick: React.Dispatch<React.SetStateAction<string | string[]>>;
};

const HashPicker: React.FC<HashPickerProps> = ({ setHashPick }) => {
  const [activePicker, setActivePicker] = useState<HashPickerMode>(HashPickerMode.BIN);
  const [binaryHashPick, setBinaryHashPick] = useState<string[]>(["0", "0", "0", "0"]);
  const [hexHashPick, setHexHashPick] = useState<string>("0");
  const [isHexValid, setIsHexValid] = useState<boolean>(true);

  const hexInputRef = useRef<HTMLInputElement>(null);

  const handleTogglePicker = (picker: HashPickerMode) => () => {
    setActivePicker(picker);
  };

  const handleToggleBinaryHashPick = (index: number) => {
    setBinaryHashPick(prev => {
      const newHashPick = [...prev];
      newHashPick[index] = newHashPick[index] === "0" ? "1" : "0";

      const newHex = binaryToHex(newHashPick);
      setHexHashPick(newHex);

      setIsHexValid(validateHexInput(newHex));

      setHashPick(newHashPick);

      return newHashPick;
    });
  };

  const handleHexInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const key = e.key.toUpperCase();

    if (validateHexInput(key)) {
      setHexHashPick(key);
      setIsHexValid(true);

      const newBinary = hexToBinary(key);
      setBinaryHashPick(newBinary);

      setHashPick(key);
    } else if (key === "BACKSPACE") {
      setHexHashPick("0");
      setIsHexValid(true);

      setBinaryHashPick(["0", "0", "0", "0"]);
      setHashPick("0");
    } else {
      setHexHashPick(key);
      setIsHexValid(false);
      setBinaryHashPick(["0", "0", "0", "0"]);
    }
  };

  useEffect(() => {
    if (activePicker === HashPickerMode.HEX && hexInputRef.current) {
      hexInputRef.current.focus();
    }
  }, [activePicker]);

  const modes: HashPickerMode[] = [HashPickerMode.BIN, HashPickerMode.HEX];

  console.log(activePicker);

  return (
    <div className="flex flex-col w-full">
      {/* Heading */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-lg font-medium text-slate-900 text-left mb-0">Bit Selector</h1>
          <h2 className="text-sm text-slate-600 text-left">Guess the last digit of the upcoming block</h2>
        </div>
        <motion.div className="flex items-center bg-gray-200 rounded-md p-1 relative" layout>
          <motion.div
            layoutId="active-container"
            className="bg-white shadow rounded-md p-1 z-0 absolute h-[36px] w-[46%] m-1"
            style={{
              left: 0,
            }}
            animate={{
              x: activePicker === HashPickerMode.BIN ? "0px" : "100%",
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
          />
          {modes.map((mode: HashPickerMode) => (
            <motion.button
              key={mode}
              className={"flex-1 px-4 py-2 text-sm rounded-md font-medium bg-transparent z-10"}
              onClick={handleTogglePicker(mode)}
            >
              {mode}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Picker */}
      <div className="flex justify-start items-start">
        {activePicker === HashPickerMode.BIN ? (
          <div className="flex space-x-2 w-full h-[90px]">
            {binaryHashPick.map((bit, index) => (
              <button
                key={index}
                className="flex flex-1 bg-gray-200 text-5xl font-bold rounded-md items-center justify-center"
                onClick={() => handleToggleBinaryHashPick(index)}
              >
                <motion.div layoutId={`bit-${index}`}>{bit}</motion.div>
                {/* <motion.div layoutId={`bit-${index}`}>{bit}</motion.div> */}
              </button>
            ))}
          </div>
        ) : (
          <div className="relative flex justify-start items-center">
            {/* Centered Input Box */}
            <div className="relative flex flex-col items-start h-[90px]">
              <input
                ref={hexInputRef}
                type="text"
                maxLength={1}
                value={hexHashPick}
                className={`w-[106px] h-[90px] text-center text-5xl font-bold rounded-md ${
                  isHexValid ? "bg-gray-200 text-black" : "bg-red-100 text-red-600"
                }`}
                onKeyDown={handleHexInput}
                style={{ caretColor: "transparent" }}
              />
            </div>
            {/* Fixed Position for Warning Message */}
            <div className="absolute top-1/2 transform -translate-y-1/2 left-[calc(100%+10px)] w-32 text-sm text-red-600 break-words">
              {!isHexValid && "Must be a hexadecimal character (0-9, A-F)."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HashPicker;
