node {
    try {
        stage('Checkout') {
            checkout scm
        }
        stage('Environment') {
            sh 'git --version'
            echo "Branch: ${env.BRANCH_NAME}"
            sh 'docker -v'
            sh 'printenv'
        }
        stage('Deploy') {
            echo "env.BUILD_NUMBER: ${env.BUILD_NUMBER}"
            sh 'docker build -t budget-web .'
            sh 'docker tag budget-web ${DOCKER_REGISTRY_URL}/budget-web:latest'
            sh "docker tag budget-web ${DOCKER_REGISTRY_URL}/budget-web:${env.BUILD_NUMBER}"
            sh 'docker push ${DOCKER_REGISTRY_URL}/budget-web'
            sh "DOCKER_HOST=tcp://${DOCKER_MANAGER} docker service update --force --update-parallelism 1 --update-delay 30s --image ${DOCKER_REGISTRY_URL}/budget-web:${env.BUILD_NUMBER} budget-web"
        }
    }
    catch (err) {
        throw err
    }
}
