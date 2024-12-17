#!/bin/bash

CONTAINER_NAME=envie-prod-postgres
USER=envie
DATABASE=envie

num_files_to_keep=6
dump_directory=./dump

# To just keep 7 last dump
i=0
for file in `ls -t $dump_directory`; do
  if [ $i -ge $num_files_to_keep ]; then
    if [ $i = ".gitkeep" ]; then
    #    echo remove;
         echo "";
    #     ls $1/$file;
      else
        rm $dump_directory/$file;
      fi;
#    echo remove;
     rm $dump_directory/$file;
#     ls $1/$file;
  fi;
#  echo $i;
  i=`expr $i + 1`;
done

#To dump
docker exec -t $CONTAINER_NAME pg_dump -U $USER $DATABASE > ./dump/envie-`date +%d-%m-%Y"__"%H_%M_%S`.sql