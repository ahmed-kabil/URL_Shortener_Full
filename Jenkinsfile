pipeline {
    agent any
    
    environment {
        FRONTEND_IMAGE = "ahmedkabil/url-frontend"
        BACKEND_IMAGE  = "ahmedkabil/url-backend"
    }
    
    stages {
        stage('SCM Checkout') {
            steps {
                // This ensures the workspace is clean before starting
                deleteDir()
                checkout scm
            }
        }
        
        stage("Building Frontend Image") {
            steps {
                dir("frontend") {
                    // Using ${env.VARIABLE_NAME} is the safest way to reference environment variables
                    sh "docker build -t ${env.FRONTEND_IMAGE}:1.${env.BUILD_NUMBER} ."
                }
            }
        }

        stage("Building Backend Image") {
            steps {
                dir("backend") {
                    sh "docker build -t ${env.BACKEND_IMAGE}:1.${env.BUILD_NUMBER} ."
                }
            }
        }

        stage("Push to Docker Hub") {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'HUB_USER', passwordVariable: 'HUB_PASSWORD')]) {
                    sh "echo ${HUB_PASSWORD} | docker login -u ${HUB_USER} --password-stdin"
                    sh "docker push ${env.FRONTEND_IMAGE}:1.${env.BUILD_NUMBER}"
                    sh "docker push ${env.BACKEND_IMAGE}:1.${env.BUILD_NUMBER}"
                }
            }
        }

       stage("update mainfests"){
        steps{
           sh "sed -i 's|image: .*|image: ${env.FRONTEND_IMAGE}:1.${env.BUILD_NUMBER}|' frontend.yml"
        }
       }
    }

    
    post {
        always {
            sh "docker logout"
        }
    }
}