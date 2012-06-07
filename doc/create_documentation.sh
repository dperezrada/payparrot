DIR=`dirname $0`
cd $DIR
DIR=`pwd`

ant all -Doutputdir=$PWD -Dapidir=$PWD/base -Dapiname=payparrot -f $PWD/libs/rest-doc-template/build.xml
