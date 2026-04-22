pipeline {
    agent any
    
    environment {
        // Use underscores; hyphens are not allowed in Groovy variable names
        FRONTEND_IMAGE = "ahmedkabil/url-frontend"
        BACKEND_IMAGE  = "ahmedkabil/url-backend"
    }
    
    stages {
        stage('SCM Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage("Building Frontend Image") {
            steps {
                dir("frontend") {
                    // Added a dot '.' at the end of the build command to specify context
                    sh "docker build -t ${ENV.FRONTEND_IMAGE}:1.${BUILD_NUMBER} ."
                }
            }
        }

        stage("Building Backend Image") {
            steps {
                dir("backend") {
                    sh "docker build -t ${ENV.BACKEND_IMAGE}:1.${BUILD_NUMBER} ."
                }
            }
        }

        stage("Push to Docker Hub") {
            steps {
                // Corrected spelling: withCredentials and credentialsId
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'HUB_USER', passwordVariable: 'HUB_PASSWORD')]) {
                    sh "echo ${HUB_PASSWORD} | docker login -u ${HUB_USER} --password-stdin"
                    // sh "docker push ${ENV.FRONTEND_IMAGE}:1.${BUILD_NUMBER}"
                    // sh "docker push ${ENV.BACKEND_IMAGE}:1.${BUILD_NUMBER}"
                }
            }
        }
    }
    
    post {
        always {
            // Good practice to logout
            sh "docker logout"
        }
    }
}