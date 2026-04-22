pipeline {
    agent any
    
    environment {
        FRONTEND_IMAGE = "ahmedkabil/url-frontend"
        BACKEND_IMAGE  = "ahmedkabil/url-backend"

        FRONTEND_CHANGED = false
        BACKEND_CHANGED = false
    }
    
    stages {
        stage('SCM Checkout') {
            steps {
                // This ensures the workspace is clean before starting
                deleteDir()
                checkout scm
            }
        }

        stage("detect changes"){
            steps{
                script {
                    FRONTEND_CHANGED = sh(script: "git diff --name-only origin/main...HEAD  | grep frontend" , returnStatus: true) == 0
                    BACKEND_CHANGED = sh(script: "git diff --name-only origin/main...HEAD  | grep backend" , returnStatus: true) == 0
                }
            }
        }
        
        stage("Building Frontend Image") {
            when{expression{return FRONTEND_CHANGED}}
            steps {
                dir("frontend") {
                    // Using ${env.VARIABLE_NAME} is the safest way to reference environment variables
                    sh "docker build -t ${env.FRONTEND_IMAGE}:1.${env.BUILD_NUMBER} ."
                }
            }
        }

        stage("Building Backend Image") {
            
            when{expression{return BACKEND_CHANGED}}
            steps {
                dir("backend") {
                    sh "docker build -t ${env.BACKEND_IMAGE}:1.${env.BUILD_NUMBER} ."
                }
            }
        }

        stage("Push to Docker Hub") {
            when{expression{return FRONTEND_CHANGED == true || BACKEND_CHANGED == true }}
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'HUB_USER', passwordVariable: 'HUB_PASSWORD')]) {
                    sh "echo ${HUB_PASSWORD} | docker login -u ${HUB_USER} --password-stdin"
                    script{
                        if(FRONTEND_CHANGED){
                            sh "docker push ${env.FRONTEND_IMAGE}:1.${env.BUILD_NUMBER}"
                        }
                        if(BACKEND_CHANGED){
                            sh "docker push ${env.BACKEND_IMAGE}:1.${env.BUILD_NUMBER}"
                        }
                    }
                    
                   
                }
            }
        }

       stage("update mainfests"){
            when{expression{return FRONTEND_CHANGED == true || BACKEND_CHANGED == true }}
        steps{
            script{
                if(FRONTEND_CHANGED){
                   sh "sed -i 's|image: .*|image: ${env.FRONTEND_IMAGE}:1.${env.BUILD_NUMBER}|' frontend.yml"
                }
                if(BACKEND_CHANGED){
                   sh "sed -i 's|image: .*|image: ${env.BACKEND_IMAGE}:1.${env.BUILD_NUMBER}|' backend.yml"
                }
            }
   
        }
       }
       stage("push the updated mainfests"){
        when{expression{return FRONTEND_CHANGED == true || BACKEND_CHANGED == true }}
        steps{
           sh 'git config user.name jenkins'
           sh 'git commit -am "updated manifests" || echo "no change to commit"'
           sh 'git push origin main'
        }
       }
    }

    
    post {
        always {
            sh "docker logout"
        }
    }
}