import {
    Popover,
    PopoverHandler,
    PopoverContent,
    Avatar,
    Button,
    Typography
} from '@material-tailwind/react';
import React from "react";
import { BuildingOffice2Icon, UserIcon } from "@heroicons/react/24/outline";
import { signOut, useSession } from 'next-auth/react';
import { UserRole } from '../enums/UserRole';

const DisplayUserInformations = () => {
    const { data: session, status } = useSession();

    const [openPopover, setOpenPopover] = React.useState(false);
    const triggers = {
        onMouseEnter: () => setOpenPopover(true),
        onMouseLeave: () => setOpenPopover(false),
    };

    return (
        <Popover open={openPopover} handler={setOpenPopover}>
            <PopoverHandler {...triggers}>
                <Button
                    variant="outlined"
                    color="teal"
                    className="flex items-center"
                    >
                    <UserIcon strokeWidth={2} className="h-4 w-4 mr-2" />{session && status === "authenticated" && session.token.role !== UserRole.USER && (session.token.username)}
                </Button>
            </PopoverHandler>
            <PopoverContent {...triggers} className="max-w-[24rem] border-gray-500">
                <div className="mb-2 flex items-center justify-between">
                    <Avatar
                        size="md"
                        variant="circular"
                        src="favicon.ico"
                        alt="logo envie"
                    />
                    <Typography
                        variant="h6"
                        color="blue-gray"
                        className="mx-auto flex items-center gap-2 font-medium"
                    >
                    <span>
                        {session && status === "authenticated" && session.token.role !== UserRole.USER && (session.token.username)}
                    </span>
                    </Typography>
                </div>

                <Typography
                    variant="h6"
                    color="blue-gray"
                    className="mt-3 flex items-center gap-2 font-medium"
                >
                    <span>
                        {/* TODO: Modifier "Prénom" et "Nom" lorsqu'il sera possible de recuperer les donnees depuis la BDD */}
                        {/*session && status === "authenticated" && session.token.role !== UserRole.USER && (session.token.firstname)*/} Prénom
                        {/*session && status === "authenticated" && session.token.role !== UserRole.USER && (session.token.lastname)*/} Nom
                    </span>
                </Typography>

                <Typography
                    variant="h6"
                    color="blue-gray"
                    className="flex items-center gap-2 font-medium"
                >
                    <span>
                        {session && status === "authenticated" && session.token.role !== UserRole.USER && (
                            session.token.role === "super-admin" ? "Super Admin" : session.token.role === "admin" ? "Administrateur" :
                            session.token.role === "warehouseman" ? "Magasinier" : session.token.role === "operator" ? "Opérateur" : "Visiteur")}
                    </span>
                </Typography>

                <div className="mt-3 flex flex-col items-center pt-3">
                    <Typography variant="small" color="gray" className="font-normal flex items-center gap-4">
                        <BuildingOffice2Icon
                            strokeWidth={2}
                            className="-mt-0.5 h-5 w-5"
                        />
                        {session && status === "authenticated" && session.token.role !== UserRole.USER && (session.token.company.name)}
                    </Typography>

                    <Typography
                        color="gray"
                        className="flex items-center gap-1 text-xs font-normal"
                    >
                        Activité :
                        {session && status === "authenticated" && session.token.role !== UserRole.USER &&
                            (session.token.company.activityType === "1" ? " Pièces detachées" : session.token.company.activityType === "2" ? " Pièces de vélo" : " Livre")}
                    </Typography>
                </div>

            </PopoverContent>
        </Popover>
    );


};
export default DisplayUserInformations;
