#!/usr/bin/env bash
source ~/.bash_profile

production=false

function show_help {
    echo "Default deploys to qa.timgrowney.com.  Use -p for production."
    exit 1;
}

# Check if config.env exists
filename="./config.env"
if [ ! -f ${filename} ]; then
    echo "Please copy sample.config.env to config.env and set your AWS credentials!"
fi

while getopts "h?p" opt; do
    case "$opt" in
    h|\?)
        show_help
        exit 0
        ;;
    p)  production=true
        ;;
    esac
done

# Read in the config.env and set AWS keys accordingly
while IFS='' read -r line || [[ -n "$line" ]]; do
    export $line
done < "$filename"

#yarn run clean
#webpack

# Pick the stage
if [ "$production" = true ]; then
    aws s3 cp build/ s3://www.timgrowney.com/ --recursive --acl public-read
else
    aws s3 cp build/ s3://qa.timgrowney.com/ --recursive --acl public-read
fi