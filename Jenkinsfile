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

        stage("set environment vars"){
            steps{
                script{
                    env.FRONTEND_CHANGED = false
                    env.BACKEND_CHANGED = false
                }
            }
        }

        stage("detect changes"){
            steps{
                script {
                echo "start the logic to deside if the servie contain changes or not"
                    def changes = sh(script: "git diff --name-only HEAD~1  HEAD",returnStdout: true).trim()
                    if (changes.contains("frontend/")){
                        echo "changes contain the frontend/"
                        evn.FRONTEND_CHANGED = true
                    }
                    if (changes.contains("backend/")){
                        echo "changes contain the backend/"
                        evn.BACKEND_CHANGED = true
                    }                    
                
                }

                echo "the variable FRONTEND_CHANGED  has a value of : ${FRONTEND_CHANGED}"
                echo "the variable BACKEND_CHANGED  has a value of : ${BACKEND_CHANGED}"
            }
        }
        
        stage("Building Frontend Image") {
            when{expression{return FRONTEND_CHANGED == true}}
            steps {
                echo "the build fronend has meet the condition and start building the fronend"
                dir("frontend") {
                   
                    sh "docker build -t ${env.FRONTEND_IMAGE}:1.${env.BUILD_NUMBER} ."
                }
            }
        }

        stage("Building Backend Image") {
            
            when{expression{return BACKEND_CHANGED == true}}
            steps {
                echo "the build backend has meet the condition and start building the backend"
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
            sshagent(['github']){
                sh '''
                    git config user.name jenkins
                    git commit -am "updated manifests" || echo "no change to commit"
                    git push origin main
                '''
            }
        }
       }
    }

    post {
        always {
            sh "docker logout"
        }
    }
}