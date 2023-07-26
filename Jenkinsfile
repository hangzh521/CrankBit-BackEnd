pipeline {
    agent any
    
    tools {
        nodejs "nodejs"
    }

    environment {
        def currentBranch = env.BRANCH_NAME.toLowerCase()
        ECR_REPO = "crankbit"
        CLUSTER_NAME = "crankbit-cluster-${currentBranch}"
        SERVICE_NAME = "crankbit-backend-service-${currentBranch}"
        TASK_DEFINITION = "crankbit-task-definition-${currentBranch}"
        task_definition_file = "task-definition.json"
        COMMIT_HASH = sh(returnStdout: true, script: 'git rev-parse HEAD').trim() 
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
        
        stage("Quality Gate") {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        
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

            steps {
                script {
                     withVault(configuration: [timeout: 60, vaultCredentialId: 'vault-jenkins-role', vaultUrl: 'http://vault.crankbit.com:8200'], vaultSecrets: [[path: 'secrets/crankbit/my-secret-text', secretValues: [[vaultKey: 'AWS_ACCESS_KEY_ID'],[vaultKey: 'AWS_SECRET_ACCESS_KEY'],[vaultKey: 'AWS_DEFAULT_REGION'], [vaultKey: 'ECR_REGISTRY'], [vaultKey: 'MONGO_URI'],[vaultKey: 'JWT_SECRET'],[vaultKey: 'JWT_LIFETIME'],[vaultKey: 'JWT_SECRET_KEY'],[vaultKey: ' PORT'],[vaultKey: 'EMAIL_SERVER_PASSWORD'],[vaultKey: 'EMAIL_SERVER_PORT'],[vaultKey: 'EMAIL_SERVER_HOST'],[vaultKey: 'EMAIL_FROM'],[vaultKey: 'EMAIL_SERVER_USER'],[vaultKey: 'SENDGRID_API_KEY']]]]) {
                        sh "docker build --build-arg MONGO_URI=$MONGO_URI --build-arg JWT_SECRET=$JWT_SECRET --build-arg JWT_SECRET_KEY=$JWT_SECRET_KEY --build-arg JWT_LIFETIME=$JWT_LIFETIME --build-arg PORT=$PORT --build-arg EMAIL_SERVER_PASSWORD=$EMAIL_SERVER_PASSWORD --build-arg EMAIL_SERVER_PORT=$EMAIL_SERVER_PORT --build-arg EMAIL_SERVER_HOST=$EMAIL_SERVER_HOST  --build-arg EMAIL_FROM=$EMAIL_FROM --build-arg EMAIL_SERVER_USER=$EMAIL_SERVER_USER --build-arg SENDGRID_API_KEY=$SENDGRID_API_KEY -t $ECR_REPO:$COMMIT_HASH ."
                        sh "aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY"
                        sh "docker tag $ECR_REPO:$COMMIT_HASH $ECR_REGISTRY/$ECR_REPO:$COMMIT_HASH"
                        sh "docker push $ECR_REGISTRY/$ECR_REPO:$COMMIT_HASH"     
                    }
                }
            }
        }

        stage('Update ECS Service') {
            when {
                expression {
                    def currentBranch = env.BRANCH_NAME.toLowerCase()
                    return currentBranch in ['main', 'uat', 'prod']
                 }
             }

		steps {
		   script {
                      def taskDefinitionJson = readFile("${task_definition_file}")
                    
                      taskDefinitionJson = taskDefinitionJson.replace('${COMMIT_HASH}', COMMIT_HASH)
                    
                      writeFile file: 'new-task-definition.json', text: taskDefinitionJson
					
                      // Get the current task definition
		      def currentTaskDef = sh(script: "aws ecs describe-services --cluster ${CLUSTER_NAME} --services ${SERVICE_NAME} --query 'services[0].taskDefinition'", returnStdout:true).trim()

		      // Create new task definition with updated image
		      def newTaskDef = currentTaskDef.replace("COMMIT_HASH_PLACEHOLDER", COMMIT_HASH)
					
                      // Register new task definition
		      def registerTaskDef = sh(script: "aws ecs register-task-definition --cli-input-json file://new-task-definition.json", returnStdout: true).trim()
                    
                      // Update service to use new task Definition
		      sh "aws ecs update-service --cluster ${CLUSTER_NAME} --service ${SERVICE_NAME} --task-definition '${TASK_DEFINITION}'"
                   }
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
