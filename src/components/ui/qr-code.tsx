import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  value: string | undefined;
}

export const QRCode = ({ value }: QRCodeProps) => {
  if (!value) return null;

  return (
    <div className="flex justify-center items-center p-4 bg-white/5 rounded-lg border border-white/10">
      <QRCodeSVG
        value={value}
        size={128}
        bgColor="transparent"
        fgColor="#ffffff"
        level="H"
      />
    </div>
  );
}; 