import { IEvaluation, IScout } from '../../src/models';
import React from 'react';
import { Avatar, Button, Divider, Form, Input, List, message, PageHeader, Radio, Select, Slider, Upload } from 'antd';
import { FORM_BUTTON_LAYOUT, FORM_LAYOUT, MESSAGES, SCOUT_URL } from './Constants';
import { recommendationNumberToString } from './SharedUtils';
import { CameraOutlined } from '@ant-design/icons';

export default function ScoutComponent(props: any) {
    const scout: IScout = props.scout;
    const subtitle = scout.position && scout.team ? `${scout.position} - ${scout.team}` : scout.team || scout.position;
    const [evaluationForm] = Form.useForm();
    const sliderMarks = {
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5'
    };
    const recommendationOptions = [
        {label: 'Yes', value: 3},
        {label: 'Maybe', value: 2},
        {label: 'No', value: 1}
    ];
    const onSaveEvaluation = async function (formValues: any) {
        await props.onSaveEvaluation(formValues, scout._id);
        evaluationForm.resetFields();
    };
    const onChangeFileUploadStatus = function (info: any) {
        switch (info.file.status) {
            case 'done':
                message.success(MESSAGES.UPLOAD_CSV_SUCCESS);
                break;
            case 'error':
                message.error(MESSAGES.UPLOAD_CSV_ERROR);
                break;
        }
    }
    return <div>
        <PageHeader avatar={{src: `${SCOUT_URL}/${scout._id}/image`, size: 'large'}}
                    title={`${scout.firstName} ${scout.lastName}`} subTitle={subtitle} onBack={props.onBack}
                    extra={props.showAdminFunctions ? [
                        <Upload name='file'
                                action={`${SCOUT_URL}/${scout._id}/image`}
                                headers={{authorization: `Bearer ${props.token}`}}
                                onChange={onChangeFileUploadStatus}><Button
                            icon={<CameraOutlined/>}/></Upload>
                    ] : []}/>
        <Divider>New Evaluation</Divider>
        <Form {...FORM_LAYOUT}
              form={evaluationForm}
              onFinish={onSaveEvaluation}>
            <Form.Item name="day" label="Day" rules={[{required: true}]}>
                <Select>
                    <Select.Option value="Day 1">Day 1</Select.Option>
                    <Select.Option value="Day 2">Day 2</Select.Option>
                    <Select.Option value="Day 3">Day 3</Select.Option>
                    <Select.Option value="Day 4">Day 4</Select.Option>
                    <Select.Option value="Day 5">Day 5</Select.Option>
                    <Select.Option value="Final">Final</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item rules={[{required: true}]} name="knowledge" label="Knowledge">
                <Slider marks={sliderMarks} min={1} max={5} defaultValue={1} step={0.5}/>
            </Form.Item>
            <Form.Item rules={[{required: true}]} name="skill" label="Skill">
                <Slider marks={sliderMarks} min={1} max={5} defaultValue={1} step={0.5}/>
            </Form.Item>
            <Form.Item rules={[{required: true}]} name="confidence" label="Confidence">
                <Slider marks={sliderMarks} min={1} max={5} defaultValue={1} step={0.5}/>
            </Form.Item>
            <Form.Item rules={[{required: true}]} name="motivation" label="Motivation">
                <Slider marks={sliderMarks} min={1} max={5} defaultValue={1} step={0.5}/>
            </Form.Item>
            <Form.Item rules={[{required: true}]} name="enthusiasm" label="Enthusaism">
                <Slider marks={sliderMarks} min={1} max={5} defaultValue={1} step={0.5}/>
            </Form.Item>
            <Form.Item rules={[{required: true}]} name="recommend" label="Recommended for Staff">
                <Radio.Group options={recommendationOptions} optionType="button"/>
            </Form.Item>
            <Form.Item rules={[{required: true}]} name="comments" label="Comments">
                <Input.TextArea/>
            </Form.Item>
            <Form.Item {...FORM_BUTTON_LAYOUT}>
                <Button type="primary" htmlType="submit">Save Evaluation</Button>
            </Form.Item>
        </Form>
        <Divider>Evaluation History</Divider>
        <List itemLayout="vertical" dataSource={scout.evaluationsAsSubject}
              renderItem={(evaluation: IEvaluation) => {
                  return <List.Item>
                      <List.Item.Meta avatar={<Avatar size='large' src={`${SCOUT_URL}/${evaluation.author._id}/image`} />} title={evaluation.day}
                                      description={`Evaluated by ${evaluation.author.firstName} ${evaluation.author.lastName} - ${evaluation.author.position}`}/>
                      <Slider min={1} max={5} value={evaluation.knowledge} disabled step={0.5}/>
                      <Slider min={1} max={5} value={evaluation.skill} disabled step={0.5}/>
                      <Slider min={1} max={5} value={evaluation.confidence} disabled step={0.5}/>
                      <Slider min={1} max={5} value={evaluation.motivation} disabled step={0.5}/>
                      <Slider min={1} max={5} value={evaluation.enthusiasm} disabled step={0.5}/>
                      <div>{evaluation.comments}</div>
                      <div>Recommendation for Staff: {recommendationNumberToString(evaluation.recommend)}</div>
                  </List.Item>
              }}/>
    </div>
}