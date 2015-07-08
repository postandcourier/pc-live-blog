echo "Pulling latest revisions for Github..."
git pull origin master
echo "Building Meteor..."
meteor build --directory /var/www/live-blog-prod/
pushd /var/www/live-blog-prod/bundle/programs/server/
echo "Installing necessary node modules..."
npm install
echo "Restarting service..."
service liveblog restart