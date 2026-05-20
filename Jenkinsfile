pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "lemichael52/fe-yhct"
        DOCKER_TAG = "latest"
        CONTAINER_NAME = "fe-yhct-container"
    }

    stages {

        stage('Pull Source') {
            steps {
                git branch: 'develop', url: 'https://github.com/Hoang3939/FE_YHCT.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                export $(cat /opt/secrets/fe-yhct.env | xargs)

                docker build \
                  --build-arg NEXT_PUBLIC_AUTH_BASE_URL=$NEXT_PUBLIC_AUTH_BASE_URL \
                  --build-arg NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
                  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
                  --build-arg NEXT_PUBLIC_CATALOG_BASE_URL=$NEXT_PUBLIC_CATALOG_BASE_URL \
                  --build-arg NEXT_PUBLIC_PIPELINE_BASE_URL=$NEXT_PUBLIC_PIPELINE_BASE_URL \
                  -t $DOCKER_IMAGE:$DOCKER_TAG .
                '''
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push Image') {
            steps {
                sh 'docker push $DOCKER_IMAGE:$DOCKER_TAG'
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true

                docker run -d \
                -p 8081:3000 \
                --env-file /opt/secrets/fe-yhct.env \
                --name $CONTAINER_NAME \
                $DOCKER_IMAGE:$DOCKER_TAG
                '''
            }
        }
    }
}