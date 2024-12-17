import {
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Navbar,
  Typography
} from '@material-tailwind/react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { UserRole } from '../enums/UserRole';
import DisplayUserInformations from "./DisplayUserInformations";

const HeaderNav = () => {
  const { data: session, status } = useSession();
  const [openNav, setOpenNav] = useState(false);

  // INDIQUER ICI LA VERSION EN COURS :

  const version = "version : 3.2.0"


  useEffect(() => {
    window.addEventListener(
        'resize',
        () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
      <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-3 lg:ml-3">

        {session &&
            status === "authenticated" &&
            session.token.role !== UserRole.USER && (
                <Typography
                    as="li"
                    variant="small"
                    color="blue-gray"
                    className="p-1 font-normal flex-none">
                  <Link href="../Add" className="flex items-center border border-transparent rounded-lg p-2 hover:border-black">
                    Ajouter une pièce
                  </Link>
                </Typography>
            )}

        {session &&
            status === "authenticated" &&
            session.token.role !== UserRole.USER && (
                <Typography
                    as="li"
                    variant="small"
                    color="blue-gray"
                    className="p-1 font-normal flex-none">
                  <Link href="../../Order" className="flex items-center border border-transparent rounded-lg p-2 hover:border-black">
                    Commandes
                  </Link>
                </Typography>
            )}

        <Typography
            as="li"
            variant="small"
            color="blue-gray"
            className="p-1 font-normal flex-none"
        >
          {/* Si l'utilisateur n'est pas connecté ou si c'est un admin, on lui laisse le choix de choisir le type de stock qu'il veut consulter */}
          {!session &&
          (status === "unauthenticated" || status === "loading") ? (
                  <Link href="/Stock" className="flex items-center border border-transparent rounded-lg p-2 hover:border-black">
                    Stock
                  </Link>
              ) :
              session &&
              status === "authenticated" &&
              (session.token.role === UserRole.USER || session.token.role === UserRole.SUPER_ADMIN) && (
                  <Link href="/Stock" className="flex items-center border border-transparent rounded-lg p-2 hover:border-black">
                    Stock
                  </Link>
              )}


          {/* Si l'utilisateur est un opérateur ou un admin, on lui affiche le stock correspondant à son type d'activité lié à sa company */}
          {session &&
              status === "authenticated" &&
              (session.token.role === UserRole.OPERATOR || session.token.role === UserRole.ADMIN || session.token.role === UserRole.WAREHOUSEMAN) && (
                  <Link href={`/Stock/${session.token.company.activityType === "1" ? "Pieces" : session.token.company.activityType === "2" ? "Bikes" : "Books"}`} className="flex items-center border border-transparent rounded-lg p-2 hover:border-black">
                    Stock {session.token.company.activityType === "1" ? "Pièces électro." : session.token.company.activityType === "2" ? "Pièces Vélos" : "Livres"}
                  </Link>
              )}
        </Typography>

        {session &&
            status === "authenticated" &&
            (session.token.role === UserRole.ADMIN || session.token.role === UserRole.SUPER_ADMIN  || session.token.role === UserRole.WAREHOUSEMAN) && (
                <Typography
                    as="li"
                    variant="small"
                    color="blue-gray"
                    className="p-1 font-normal flex-none"
                >
                  <Link href="../../PreparationOrder" className="flex items-center border border-transparent rounded-lg p-2 hover:border-black">
                    Préparations
                  </Link>
                </Typography>
            )}

        {session &&
            status === "authenticated" &&
            (session.token.role === UserRole.ADMIN || session.token.role === UserRole.SUPER_ADMIN) && (
                <Typography
                    as="li"
                    variant="small"
                    color="blue-gray"
                    className="p-1 font-normal flex-none"
                >
                  <Menu>
                    <MenuHandler>
                      <Button color="teal">Administration</Button>
                    </MenuHandler>
                    <MenuList>
                      <Link href={"/Companies"}>
                        <MenuItem>Entreprises</MenuItem>
                      </Link>
                      <Link href={"/Storage"}>
                        <MenuItem>Entrepôt</MenuItem>
                      </Link>
                      <Link href={"/StorageLocationsList"}>
                        <MenuItem>Emplacements de stockage</MenuItem>
                      </Link>

                      <Link href="/Admin/Brand">
                        <MenuItem>Marque</MenuItem>
                      </Link>
                      <Link href="/Admin/Family">
                        <MenuItem>Famille</MenuItem>
                      </Link>
                      <Link href="/Admin/Subfamily">
                        <MenuItem>Sous-famille</MenuItem>
                      </Link>
                      <Link href="/Admin/User">
                        <MenuItem>Utilisateurs</MenuItem>
                      </Link>
                    </MenuList>
                  </Menu>
                </Typography>
            )}

        {!session &&
            (status === "unauthenticated" || status === "loading") && (
                <Typography
                    as="li"
                    variant="small"
                    color="blue-gray"
                    className="p-1 font-normal flex-none"
                >
                  <Link href="/Login">
                    <Button
                        color="teal"
                    >
                      Se connecter
                    </Button>
                  </Link>
                </Typography>
            )}

        {session && status === "authenticated" && (
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="p-1 font-normal flex-none"
            >
              <Button
                  color="teal"
                  onClick={() => signOut()}
              >
                Se déconnecter
              </Button>
            </Typography>
        )}
      </ul>
  );

  return (
<>
    <div className="flex justify-end mt-0 mr-3">
        {version}
    </div>
    <Navbar className="bg-white bg-opacity-100 mx-auto max-w-screen-xl py-2 px-4 lg:px-8 lg:py-4 border-1  border-black mr-50 ml-50 rounded-none shadow-2xl mb-5">

        <div className="container mx-auto flex items-center justify-between ">
            <div>
                {session &&
                    status === "authenticated" &&
                    session.token.role !== UserRole.USER && (
                        <DisplayUserInformations/>
                    )}
            </div>

            <nav className="hidden lg:block">{navList}</nav>

            <IconButton
                variant="text"
                className="ml-auto h-6 w-6 bg-background text-inherit focus:bg-transparent active:bg-transparent lg:hidden"
                ripple={false}
                color="amber"
                onClick={() => setOpenNav(!openNav)}
            >
                {openNav ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                )}
            </IconButton>
        </div>
    </Navbar>
</>

  );
};
export default HeaderNav;
