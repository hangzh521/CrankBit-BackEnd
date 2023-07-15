pipeline {
    agent any
    
    tools {
        nodejs "nodejs"
    }

    stages {

        stage('SonarQube Scan') {
            steps {
                script {
                    def scannerHome = tool 'SonarScannerBackend'
                    withSonarQubeEnv('SonarQube Server Backend') {
                        sh "${scannerHome}/bin/sonar-scanner"   
                    }
                }
            }
        }
        
        // stage("Quality Gate") {
        //     steps {
        //         timeout(time: 2, unit: 'MINUTES') {
        //             waitForQualityGate abortPipeline: true
        //         }
        //     }
        // }
        
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                sh 'npm run test'
            }
        }
        
        stage('Deploy') {

            when {
                expression {
                    def currentBranch = env.BRANCH_NAME.toLowerCase()
                    return currentBranch in ['main', 'uat', 'prod']
                }
            }

            environment {
                def currentBranch = env.BRANCH_NAME.toLowerCase()
                ECR_REPO = "crankbit-${currentBranch}"
                CLUSTER_NAME = "crankbit-cluster-${currentBranch}"
                SERVICE_NAME = "crankbit-backend-service-${currentBranch}"
                TASK_DEFINITION = "crankbit-task-definition-${currentBranch}"
                ECR_REGISTRY = credentials('ECR_REGISTRY')
                IMAGE_TAG = 'latest'
                // MONGO_URI = credentials('MONGO_URI')
                // JWT_SECRET = credentials('JWT_SECRET')
                // JWT_LIFETIME = credentials('JWT_LIFETIME')
                // JWT_SECRET_KEY = credentials('JWT_SECRET_KEY')
                // PORT = credentials('PORT')
                // EMAIL_SERVER_PASSWORD = credentials('EMAIL_SERVER_PASSWORD')
                // EMAIL_SERVER_PORT = credentials('EMAIL_SERVER_PORT')
                // EMAIL_SERVER_HOST = credentials('EMAIL_SERVER_HOST')
                // EMAIL_FROM = credentials('EMAIL_FROM')
                // EMAIL_SERVER_USER = credentials('EMAIL_SERVER_USER')
                // SENDGRID_API_KEY = credentials('SENDGRID_API_KEY')
                AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
                AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
                AWS_DEFAULT_REGION = credentials('AWS_DEFAULT_REGION')
            }

            steps {
                    sh "docker build --env-file /root/crankbit-backend/.env -t $ECR_REPO:$IMAGE_TAG ."
                    sh "aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY"
                    sh "docker tag $ECR_REPO:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPO:$IMAGE_TAG"
                    sh "docker push $ECR_REGISTRY/$ECR_REPO:$IMAGE_TAG"
                    sh "aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --task-definition $TASK_DEFINITION --force-new-deployment"
                }
            }
        }
    

    post {
        failure {
            emailext(attachLog: true, body: 'failed', subject: 'backend build failed', to: 'zhaohang521@hotmail.com')
            echo "Your backend build failed"
        }

        success {
            emailext(attachLog: true, body: 'succeeded', subject: 'backend build succeeded', to: 'zhaohang521@hotmail.com')
            echo "Your backend build succeeded"
        }
    }
}