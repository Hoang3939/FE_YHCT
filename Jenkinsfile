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
                sh 'docker build -t $DOCKER_IMAGE:$DOCKER_TAG .'
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
                --name $CONTAINER_NAME \
                $DOCKER_IMAGE:$DOCKER_TAG
                '''
            }
        }
    }
}