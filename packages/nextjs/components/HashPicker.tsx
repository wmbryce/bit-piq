import { useEffect, useState } from "react";

const HashPicker = () => {
  const [binaryHashPick, setBinaryHashPick] = useState<string[]>(["0", "0", "0", "0"]);
  const [hexHashPick, setHexHashPick] = useState<string>("0");
  const [isHexValid, setIsHexValid] = useState<boolean>(true);

  // Synchronize binaryHashPick when hexHashPick changes
  useEffect(() => {
    const hexValue = parseInt(hexHashPick, 16);
    if (!isNaN(hexValue)) {
      const binaryValue = hexValue.toString(2).padStart(4, "0").split("");
      setBinaryHashPick(binaryValue);
    }
  }, [hexHashPick]);

  // Synchronize hexHashPick when binaryHashPick changes
  useEffect(() => {
    const binaryValue = binaryHashPick.join("");
    const hexValue = parseInt(binaryValue, 2).toString(16).toUpperCase();
    setHexHashPick(hexValue);
    setIsHexValid(true);
  }, [binaryHashPick]);

  const handleToggleBinaryHashPick = (index: number) => {
    setBinaryHashPick(prev => {
      const newHashPick = [...prev];
      newHashPick[index] = newHashPick[index] === "0" ? "1" : "0";
      return newHashPick;
    });
  };

  const handleHexHashPick = (input: string) => {
    if (input === "") {
      setHexHashPick("");
      setIsHexValid(true);
      return;
    }

    const validHexChar = /^[0-9A-Fa-f]$/;
    if (validHexChar.test(input)) {
      setHexHashPick(input.toUpperCase());
      setIsHexValid(true);
    } else {
      setHexHashPick(input);
      setIsHexValid(false);
    }
  };

  return (
    <div className="flex flex-row">
      {/* Binary Hash Pick */}
      <div className="flex flex-row items-center">
        <h1 className="text-2xl font-bold">Binary</h1>
        {binaryHashPick.map((bit, index) => (
          <button
            key={index}
            className="w-20 h-20 bg-gray-300 mx-2 rounded-md text-4xl font-bold"
            onClick={() => handleToggleBinaryHashPick(index)}
          >
            {bit}
          </button>
        ))}
      </div>

      {/* Hexadecimal Hash Pick */}
      <div className="flex flex-row items-center ml-8">
        <h1 className="text-2xl font-bold mr-2">Hex</h1>
        <div className="relative">
          <input
            type="text"
            maxLength={1}
            value={hexHashPick}
            className={`w-20 h-20 text-center rounded-md text-4xl font-bold ${
              isHexValid ? "bg-gray-300 text-black" : "bg-red-100 text-red-600"
            }`}
            onChange={e => handleHexHashPick(e.target.value)}
            onKeyDown={e => handleHexInput(e, setHexHashPick, setIsHexValid)}
            style={{ caretColor: "transparent" }}
          />
          {!isHexValid && (
            <div className="absolute left-0 w-full mt-2 text-sm text-center text-red-600">
              Must be a hexadecimal character (0-9, A-F).
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const validateHexInput = (input: string) => {
  const validHexChar = /^[0-9A-Fa-f]$/;
  return validHexChar.test(input);
};

const handleHexInput = (
  e: React.KeyboardEvent<HTMLInputElement>,
  setHexHashPick: React.Dispatch<React.SetStateAction<string>>,
  setIsHexValid: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  e.preventDefault();

  const key = e.key.toUpperCase();

  if (validateHexInput(key)) {
    setHexHashPick(key);
    setIsHexValid(true);
  } else if (key === "BACKSPACE") {
    setHexHashPick("");
    setIsHexValid(true);
  } else {
    setHexHashPick(key);
    setIsHexValid(false);
  }
};

export default HashPicker;
