import { QrCodeIcon } from '@heroicons/react/20/solid';
import { Button } from '@material-tailwind/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import HeaderNav from '../components/HeaderNav';
import QrModal from '../components/Qrcode/QrModal';
import PrintStorageLocationModal from '../components/StorageLocation/PrintStorageLocationModal';
import { StorageLocation } from '../models/StorageLocation/StorageLocation';

const StorageLocationsList = () => {
  const [storageLocations, setStorageLocations] = useState<StorageLocation[]>([]);
  const [qrData, setQrData] = useState<string>('');
  const [qrDataText, setQrDataText] = useState<string>('');
  const [openQrModal, setOpenQrModal] = useState<boolean>(false);
  const [isOpenPrintStorageLocationModal, setIsOpenPrintStorageLocationModal] = useState<boolean>(false);

  const handleQrModal = (data: string, text: string) => {
    setQrData(data);
    setOpenQrModal(true);
    setQrDataText(text);
  };

  const togglePrintStorageLocationModal = () => {
    setIsOpenPrintStorageLocationModal(!isOpenPrintStorageLocationModal);
  }

  const handleClosePrintStorageLocationModal = () => {
    setIsOpenPrintStorageLocationModal(false);
  };

  useEffect(() => {
    axios.get(process.env.API_URL + 'storage-locations').then(({ data }) => {
      setStorageLocations(data);
    });
  }, []);

  return (
    <div className="bg-background h-screen pt-5">
      <QrModal
        data={qrData}
        showModal={openQrModal}
        setShowModal={setOpenQrModal}
        text={qrDataText}
      />
      
      <PrintStorageLocationModal open={isOpenPrintStorageLocationModal} onClose={handleClosePrintStorageLocationModal}/>

      <HeaderNav />

      <div className="bg-white mt-5 mx-auto p-4 text-center w-fit rounded-lg">
        <Button
          color="teal"
          onClick={togglePrintStorageLocationModal}
        >
          Imprimer des emplacements de stockage
        </Button>
      </div>

      <table className="table mx-auto mt-3 p-4 bg-white shadow text-center text-gray-900 rounded-lg divide-y-2">
        <thead>
          <tr>
            <th className="p-4">Entreprise</th>
            <th className="p-4">Entrepot de stockage</th>
            <th className="p-4">Numéro de rangé</th>
            <th className="p-4">Numéro de colonne</th>
            <th className="p-4">Numéro d&apos;étagère</th>
            <th className="p-4">Numéro emplacement</th>
          </tr>
        </thead>
        <tbody className="divide-y-2">
          {storageLocations.map((storageLocation) => (
            <tr key={storageLocation.id}>
              <td className="p-4">{storageLocation.storage?.company.name} (N° {storageLocation.storage?.company.id})</td>
              <td className="p-4">{storageLocation.storage?.name}</td>
              <td className="p-4">{storageLocation.rowNumber}</td>
              <td className="p-4">{storageLocation.columnNumber}</td>
              <td className="p-4">{storageLocation.shelfNumber}</td>
              <td className="p-4">{storageLocation.locationNumber}</td>

              <td className="p-4">
                <Button
                  color="teal"
                  onClick={() =>
                    handleQrModal(
                      storageLocation.id,
                        'REF :'+storageLocation.uid.toString()+' | '+
                        storageLocation.storage?.company.id + ' ' +
                        storageLocation.storage?.internalName + ' - ' +
                      storageLocation.rowNumber +
                        ' ' +
                        storageLocation.columnNumber +
                        ' ' +
                        storageLocation.shelfNumber +
                        ' ' +
                        storageLocation.locationNumber
                    )
                  }
                >
                  <QrCodeIcon className="w-5" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StorageLocationsList;