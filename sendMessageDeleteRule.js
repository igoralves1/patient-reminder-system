import { EventBridgeClient, DeleteRuleCommand, RemoveTargetsCommand } from "@aws-sdk/client-eventbridge";

const eventBridge = new EventBridgeClient({ region: "us-east-1" });

export const sendMessageDeleteRule = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const ruleName = event.ruleName;

    // Your processing logic here
    console.log(`Processing event with ID: ${event.id}`);

    // Delete the CloudWatch Event rule
    try {

        //Send a message to the WhatsApp logic here

        // ...


        //If message is sent successfuly remove the rule
        await eventBridge.send(new DeleteRuleCommand({ Name: ruleName }));
        console.log(`Rule ${ruleName} deleted successfully`);

        // Remove associated targets - No need to remove the target. We will create a rule that sends the parameter to the same lambda (target). Just need to remove the rule.
        // await eventBridge.send(new RemoveTargetsCommand({ Rule: ruleName, Ids: ['1'] }));
        // console.log(`Targets for rule ${ruleName} removed successfully`);
    } catch (err) {
        console.error(`Error deleting rule ${ruleName}:`, err);
        throw err;
    }

    return { status: 'success' };
};
