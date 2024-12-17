import {
  Card,
  CardBody,
  CardHeader,
  Typography } from '@material-tailwind/react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react';
import HeaderNav from '../components/HeaderNav';
import logo from '../public/logo.webp';

const Index = () => {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(1);

  const Accordeon = (value: number) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <div className="lg:h-screen h-full bg-cover pt-5">
      <HeaderNav />

        <div className="mt-20 mx-auto max-w-screen-xl justify-center  rounded-3xl text-center flex-col md:flex lg:flex-row">

          <Card className="lg:w-8/12 mx-16 lg:mx-0 rounded-none">
            <CardHeader color="green" className="relative h-56">
              <Image
                  className="h-full w-full rounded-none"
                  src={logo}
                  width={'10000'}
                  height={'100'}
                  alt={'Logo de Envie'}
                  priority={true}
              />
            </CardHeader>
            <CardBody className="shadow-2xl">
              <Typography variant="h5" className="text-center mb-2">
                Envie, nos valeurs redonnent de la valeur!
              </Typography>
              <Typography className="text-justify">
                Les structures Envie partagent des valeurs fortes : chacun a accès à l’emploi et à la formation, chacun peut,
                quelque soient ses revenus, s’équiper de biens de consommation de qualité,
                les biens de consommation usagés sont en priorité rénovés pour être réemployés ou recyclés et traités,
                afin de diminuer leur impact global sur l’environnement. <br/><br/>
                La mission est engagée car Envie favorise l’accès au monde du travail
                et de la formation des personnes éloignées de l’emploi en récupérant les équipements électriques
                et électroniques usagés pour les rénover et les revendre à petits prix
                et recycler tous les déchets dans le respect de l’environnement. <br/><br/>
                La charte Envie garantit la cohérence de l’engagement du réseau sur tout le territoire.
              </Typography>
            </CardBody>
          </Card>

      </div>

    </div>
  );
};

export default Index;
