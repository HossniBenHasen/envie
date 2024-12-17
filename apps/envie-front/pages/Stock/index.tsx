import { Card, CardBody, Typography } from '@material-tailwind/react';
import Link from 'next/link';
import HeaderNav from "../../components/HeaderNav";

const Stock = () => {
  return (
    <div className="bg-background h-screen  pt-5">
      <HeaderNav />

      <div className="flex grid-cols-3 justify-center gap-8 mt-20 center ">
        <Link href="Stock/Books">
          <Card className="w-96 h-44">
            <CardBody className="text-center">
              <Typography variant="h3" className="">
                Livres
              </Typography>
            </CardBody>
          </Card>
        </Link>

        <Link href="Stock/Pieces">
          <Card className="w-96 h-44">
            <CardBody className="text-center">
              <Typography variant="h3" className="mb-2 align-middle">
                Pieces électroménager
              </Typography>
            </CardBody>
          </Card>
        </Link>

        <Link href="Stock/Bikes">
          <Card className="w-96 h-44">
            <CardBody className="text-center">
              <Typography variant="h3" className="mb-2 align-middle">
                Pieces de remplacements de vélos
              </Typography>
            </CardBody>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Stock;
