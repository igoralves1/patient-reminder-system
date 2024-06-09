// const { EventBridgeClient, PutRuleCommand, PutTargetsCommand } = require("@aws-sdk/client-eventbridge");
// const { LambdaClient, AddPermissionCommand } = require("@aws-sdk/client-lambda");

// Initialize clients with the respective regions
// const eventBridge = new EventBridgeClient({ region: "us-east-1" });
// const lambda = new LambdaClient({ region: "us-east-1" });


module.exports.setRememberReturn = async (event) => {

    // client_id=123&client_key=hd6fuf88fuj&pacient_id=7474&timestampDate=1716029080000&paciente_name=Igor%20Alves&phone=1585482703&process_nb=20&process_name=Ortodontia&whatsappID=123456

    console.log("Received event:", JSON.stringify(event, null, 2));


    console.log('event:', event);
    console.log('type of event:', typeof(event));

    let queryStringParameters = event.queryStringParameters
    console.log('queryStringParameters:', queryStringParameters);
    console.log('type of queryStringParameters:', typeof(queryStringParameters));
    
    //   patient_info: {
        // client_id: "123", the dentist ID - client of this system
        // client_key: "hd6fuf88fuj",
        // pacient_id: "837",
        // paciente_name: "Igor Alves",
        // phone: "1585482703",
        // process_name: "Ortodontia",
        // process_nb: "20",
        // timestampDate: "1716022496",
        // whatsappID: "123456",
    //     }

    // Initial timestamp (example)
    // let timestamp = Date.now(); // or use your own timestamp value

    // Convert the timestamp to a Date object
    let dt = queryStringParameters.timestampDate
    console.log('type of dt:', typeof(dt));
    console.log('dt:', dt);

    let date = new Date(eval(dt));
    console.log('date:', date);
    // Add 60 days (60 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    // let daysToAdd = 60;
    // date.setTime(date.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

    let schedule30DaysDate = date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
    console.log('schedule30DaysDate:', schedule30DaysDate);
    let schedule60DaysDate = date.setTime(date.getTime() + 60 * 24 * 60 * 60 * 1000);
    console.log('schedule60DaysDate:', schedule60DaysDate);
    let schedule90DaysDate = date.setTime(date.getTime() + 90 * 24 * 60 * 60 * 1000);
    console.log('schedule90DaysDate:', schedule90DaysDate);

    // For each date create an event. The event will call a lambda. This lambda will receive a payload from the event at the moment when it is created
    // eventRuleNameUnique = pacient_id + timestampDate + ev30Days or ev60Days or ev90Days
    // await createEvent(paciente_name, whatsappID, schedule30DaysDate, messageToPatient, eventRuleNameUnique)

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Sistema de agendamento de pos atendimento',
        // input: event,
        patqueryStringParameterst_info: queryStringParameters,
        schedule30DaysDate: 'Sr '+queryStringParameters.paciente_name+' hoje, dia '+new Date(schedule30DaysDate)+' estaremos te esperando para a avaliacao de 30 dias. Gostaria de reservar o horário?',
        schedule60DaysDate: 'Sr '+queryStringParameters.paciente_name+' hoje, dia '+new Date(schedule60DaysDate)+' estaremos te esperando para a avaliacao de 60 dias. Gostaria de reservar o horário?',
        schedule90DaysDate: 'Sr '+queryStringParameters.paciente_name+' hoje dia '+new Date(schedule90DaysDate)+' estaremos te esperando para a avaliacao de 90 dias. Gostaria de reservar o horário?'
      }
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};


async function createEvent (paciente_name, whatsappID, schedule30DaysDate, messageToPatient) {

    // Rule name is created inside a loop for each period: Rule_30_days_orto_process_20_pacienteId_38476, Rule_60_days_orto_process_20_pacienteId_38476,
    // const ruleName = event.ruleName;

    const ruleName = `one-time-event-${Date.now()}`;

    // Schedule the event
    const params = {
        Name: ruleName,
        ScheduleExpression: 'at(2024-05-18T15:00:00Z)',  // Adjust the time as needed
        State: 'ENABLED',
    };

    try {
        // Create the rule
        await eventBridge.send(new PutRuleCommand(params));
        console.log(`Rule ${ruleName} created successfully`);

        // Define the target (Lambda function to be triggered)
        const targetParams = {
            Rule: ruleName,
            Targets: [
                {
                    Id: '1',
                    Arn: 'arn:aws:lambda:us-east-1:123456789012:function:YourLambdaFunctionName',
                    Input: JSON.stringify({ id: 373, ruleName: ruleName }),
                },
            ],
        };

        // Add the target
        await eventBridge.send(new PutTargetsCommand(targetParams));
        console.log(`Target added to rule ${ruleName} successfully`);

        // Grant permissions to EventBridge to invoke the Lambda function
        const permissionParams = {
            FunctionName: 'YourLambdaFunctionName',
            StatementId: `EventBridgeInvoke-${ruleName}`,
            Action: 'lambda:InvokeFunction',
            Principal: 'events.amazonaws.com',
            SourceArn: `arn:aws:events:us-east-1:123456789012:rule/${ruleName}`,
        };

        await lambda.send(new AddPermissionCommand(permissionParams));
        console.log(`Permission added to Lambda for rule ${ruleName} successfully`);

    } catch (err) {
        console.error(`Error creating rule ${ruleName}:`, err);
        throw err;
    }

    return { status: 'success', ruleName: ruleName };
};